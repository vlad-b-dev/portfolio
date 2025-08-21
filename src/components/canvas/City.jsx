import React, {
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  AdaptiveDpr,
  PerformanceMonitor,
} from "@react-three/drei";
import { Vector3 } from "three";
import CanvasLoader from "../Loader";

const LAYER_PATHS = [
  "./city/city-layer-1.glb",
  "./city/city-layer-2.glb",
  "./city/city-layer-3.glb",
  "./city/city-layer-4.glb",
  "./city/city-layer-5.glb",
  "./city/city-layer-6.glb",
];

const FADE_DURATION = 1.2;
const DOLLY_DURATION = 3;
const OVERLAY_FADE_DURATION = 500;
const INITIAL_CAMERA_POSITION = [20, 3, 5];
const FINAL_CAMERA_POSITION = [20, 3, 5];
const DOLLY_START_MULTIPLIER = 1.5;
const ROTATION_SPEEDS = { fast: 1, slow: 0.02 };
const MOBILE_BREAKPOINT = 500;

const easeInOutCubic = (x) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

const CityLayer = ({ path, onPrepared }) => {
  const gltf = useGLTF(path);
  const materialsRef = useRef([]);
  const originalOpacityRef = useRef(new Map());
  const progressRef = useRef(0);
  const [prepared, setPrepared] = useState(false);
  const notifiedPreparedRef = useRef(false);
  const { invalidate } = useThree();

  const processMaterials = useCallback(() => {
    materialsRef.current = [];
    originalOpacityRef.current = new Map();

    gltf.scene.traverse((object) => {
      if (object.isMesh && object.material) {
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];
        materials.forEach((material) => {
          if (!originalOpacityRef.current.has(material)) {
            originalOpacityRef.current.set(material, material.opacity ?? 1);
          }
          material.transparent = true;
          material.opacity = 0;
          materialsRef.current.push(material);
        });
      }
    });
  }, [gltf]);

  useLayoutEffect(() => {
    processMaterials();
    setPrepared(true);
    invalidate();
  }, [processMaterials, invalidate]);

  useEffect(() => {
    if (prepared && onPrepared && !notifiedPreparedRef.current) {
      notifiedPreparedRef.current = true;
      onPrepared();
    }
  }, [prepared, onPrepared]);

  useFrame((_, delta) => {
    if (!prepared || progressRef.current >= 1) return;

    progressRef.current = Math.min(
      1,
      progressRef.current + delta / FADE_DURATION
    );
    const t = easeInOutCubic(progressRef.current);

    materialsRef.current.forEach((material) => {
      const target = originalOpacityRef.current.get(material) || 1;
      material.opacity = target * t;
    });

    if (progressRef.current >= 1) {
      materialsRef.current.forEach((material) => {
        const target = originalOpacityRef.current.get(material) || 1;
        material.opacity = target;
        if (target >= 1) material.transparent = false;
      });
    }

    if (progressRef.current < 1) invalidate();
  });

  return <primitive object={gltf.scene} visible={prepared} />;
};

const CameraDolly = ({
  start,
  durationSec = DOLLY_DURATION,
  finalPosition = FINAL_CAMERA_POSITION,
  controlsRef,
  progressRef,
}) => {
  const { camera, invalidate } = useThree();
  const startedRef = useRef(false);
  const doneRef = useRef(false);
  const fromRef = useRef(null);
  const toRef = useRef(null);
  const targetRef = useRef(new Vector3());
  const localProgressRef = useRef(0);

  const setupDolly = useCallback(() => {
    const currentTarget =
      controlsRef?.current?.target?.clone() || new Vector3();
    targetRef.current.copy(currentTarget);

    const toVec = controlsRef?.current
      ? camera.position.clone()
      : new Vector3(...finalPosition);
    const direction = new Vector3()
      .subVectors(toVec, currentTarget)
      .normalize();
    const finalDistance = currentTarget.distanceTo(toVec);
    const startDistance = finalDistance * DOLLY_START_MULTIPLIER;
    const fromVec = new Vector3()
      .copy(currentTarget)
      .addScaledVector(direction, startDistance);

    camera.position.copy(fromVec);
    camera.lookAt(currentTarget);
    camera.updateProjectionMatrix();

    fromRef.current = fromVec;
    toRef.current = toVec;
    localProgressRef.current = 0;
    startedRef.current = true;

    if (controlsRef?.current) controlsRef.current.enabled = false;
    invalidate();
  }, [camera, controlsRef, finalPosition, invalidate]);

  useLayoutEffect(() => {
    if (!start || startedRef.current || doneRef.current) return;
    setupDolly();
  }, [start, setupDolly]);

  useFrame((_, delta) => {
    if (!startedRef.current || doneRef.current) return;

    const duration = Math.max(0.001, durationSec);
    localProgressRef.current = Math.min(
      1,
      localProgressRef.current + delta / duration
    );
    const t = easeInOutCubic(localProgressRef.current);

    if (progressRef) progressRef.current = t;

    const from = fromRef.current;
    const to = toRef.current;
    if (!from || !to) return;

    camera.position.lerpVectors(from, to, t);
    camera.lookAt(targetRef.current);

    if (localProgressRef.current >= 1) {
      camera.position.copy(to);
      camera.lookAt(targetRef.current);
      doneRef.current = true;

      if (controlsRef?.current) controlsRef.current.enabled = true;
      if (progressRef) progressRef.current = 1;
    }

    invalidate();
  });

  return null;
};

const City = ({ isMobile, onFirstPrepared, dollyProgressRef }) => {
  const [visibleLayers] = useState(LAYER_PATHS.length);
  const groupRef = useRef();
  const pointLightRef = useRef();
  const lightProgressRef = useRef(0);
  const { invalidate } = useThree();

  const mobileConfig = useMemo(
    () => ({
      scale: 0.9,
      position: isMobile ? [0, -3, -1] : [0, -3.25, -1.5],
      rotation: [0, (Math.PI / 2) * 3, 0],
    }),
    [isMobile]
  );

  useFrame((_, delta) => {
    if (pointLightRef.current && lightProgressRef.current < 1) {
      lightProgressRef.current = Math.min(
        1,
        lightProgressRef.current + delta / 10
      );
      const t = easeInOutCubic(lightProgressRef.current);
      pointLightRef.current.intensity = 22 * t;
    }

    const t = Math.min(1, Math.max(0, dollyProgressRef?.current ?? 1));
    const currentSpeed =
      ROTATION_SPEEDS.fast * (1 - t) + ROTATION_SPEEDS.slow * t;

    if (groupRef.current) {
      groupRef.current.rotation.y += currentSpeed * delta;
    }

    invalidate();
  });

  return (
    <mesh>
      <hemisphereLight intensity={1.5} groundColor="green" />
      <spotLight
        position={[20, 50, 50]}
        angle={1.5}
        penumbra={0.5}
        intensity={2.5}
        castShadow
        shadow-mapSize={524}
      />
      <pointLight
        ref={pointLightRef}
        intensity={0}
        color="#84ffe9"
      />

      <group
        ref={groupRef}
        scale={mobileConfig.scale}
        position={mobileConfig.position}
        rotation={mobileConfig.rotation}
      >
        {LAYER_PATHS.slice(0, visibleLayers).map((path, index) => (
          <Suspense key={path} fallback={null}>
            <CityLayer
              path={path}
              onPrepared={index === 0 ? onFirstPrepared : undefined}
            />
          </Suspense>
        ))}
      </group>
    </mesh>
  );
};

const CityCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const [dollyStart, setDollyStart] = useState(false);

  const overlayStartRef = useRef(null);
  const controlsRef = useRef(null);
  const dollyProgressRef = useRef(1);

  const mediaQuery = useMemo(
    () => window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`),
    []
  );

  useEffect(() => {
    const handleMediaQueryChange = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () =>
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, [mediaQuery]);

  const startOverlayFade = useCallback(() => {
    if (overlayStartRef.current !== null) return;

    overlayStartRef.current = performance.now();
    const step = (now) => {
      const elapsed = now - overlayStartRef.current;
      const t = Math.min(1, elapsed / OVERLAY_FADE_DURATION);
      const eased = easeInOutCubic(t);
      setOverlayOpacity(1 - eased);

      if (t < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
    setDollyStart(true);
  }, []);

  const overlayStyles = useMemo(
    () => ({
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "#0b0d12",
      pointerEvents: "none",
      opacity: overlayOpacity,
      zIndex: 9999,
    }),
    [overlayOpacity]
  );

  return (
    <>
      <Canvas
        frameloop="demand"
        shadows
        dpr={[0.7, 1.2]}
        camera={{ position: INITIAL_CAMERA_POSITION, fov: 25 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls
            ref={controlsRef}
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          {overlayOpacity === 0 && (
            <PerformanceMonitor onDecline={() => {}}>
              <AdaptiveDpr pixelated />
            </PerformanceMonitor>
          )}
          <City
            isMobile={isMobile}
            onFirstPrepared={startOverlayFade}
            dollyProgressRef={dollyProgressRef}
          />
          <CameraDolly
            start={dollyStart}
            durationSec={DOLLY_DURATION}
            finalPosition={FINAL_CAMERA_POSITION}
            controlsRef={controlsRef}
            progressRef={dollyProgressRef}
          />
        </Suspense>
      </Canvas>
      <div style={overlayStyles} />
    </>
  );
};

useGLTF.preload(LAYER_PATHS[0]);

export default CityCanvas;
