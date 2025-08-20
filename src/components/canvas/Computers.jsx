/* eslint-disable */
import React, {
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  AdaptiveDpr,
  PerformanceMonitor,
} from "@react-three/drei";
import { Vector3, Spherical } from "three";

import CanvasLoader from "../Loader";

const layerPaths = [
  "./city/city-layer-1.glb",
  "./city/city-layer-2.glb",
  "./city/city-layer-3.glb",
  "./city/city-layer-4.glb",
  "./city/city-layer-5.glb",
  "./city/city-layer-6.glb",
];

const CityLayer = ({ path, onPrepared }) => {
  const gltf = useGLTF(path);
  const materialsRef = useRef([]);
  const originalOpacityRef = useRef(new Map());
  const progressRef = useRef(0);
  const [prepared, setPrepared] = useState(false);
  const notifiedPreparedRef = useRef(false);
  const easeInOutCubic = (x) =>
    x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const invalidate = useThree((state) => state.invalidate);

  useLayoutEffect(() => {
    materialsRef.current = [];
    originalOpacityRef.current = new Map();

    gltf.scene.traverse((object) => {
      if (object.isMesh && object.material) {
        const materialList = Array.isArray(object.material)
          ? object.material
          : [object.material];
        materialList.forEach((material) => {
          if (!originalOpacityRef.current.has(material)) {
            originalOpacityRef.current.set(
              material,
              typeof material.opacity === "number" ? material.opacity : 1
            );
          }
          material.transparent = true;
          material.opacity = 0;
          materialsRef.current.push(material);
        });
      }
    });
    setPrepared(true);
    // Kick off the first frame to start the fade when using frameloop="demand"
    invalidate();
  }, [gltf]);

  useEffect(() => {
    if (prepared && onPrepared && !notifiedPreparedRef.current) {
      notifiedPreparedRef.current = true;
      onPrepared();
    }
  }, [prepared, onPrepared]);

  useFrame((_, delta) => {
    if (!prepared) return;
    if (progressRef.current >= 1) return;

    const fadeDurationSeconds = 1.2;
    progressRef.current = Math.min(
      1,
      progressRef.current + delta / fadeDurationSeconds
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

    // Request another frame while fading when using frameloop="demand"
    if (progressRef.current < 1) {
      invalidate();
    }
  });

  return <primitive object={gltf.scene} visible={prepared} />;
};

// PropTypes removed to avoid runtime dependency on 'prop-types'

const CameraDolly = ({
  start,
  durationSec = 2,
  finalPosition = [20, 3, 5],
  controlsRef,
  progressRef, // optional shared ref to expose eased progress [0..1]
}) => {
  const { camera, invalidate } = useThree();
  const startedRef = useRef(false);
  const doneRef = useRef(false);
  const fromRef = useRef(null);
  const toRef = useRef(null);
  const targetRef = useRef(new Vector3(0, 0, 0));
  const localProgressRef = useRef(0);

  const easeInOutCubic = (x) =>
    x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

  useLayoutEffect(() => {
    if (!start || startedRef.current || doneRef.current) return;

    const currentTarget = controlsRef?.current?.target
      ? controlsRef.current.target.clone()
      : new Vector3(0, 0, 0);
    targetRef.current.copy(currentTarget);

    // Use the live camera position as the final destination to match controls' constraints
    const toVec = controlsRef?.current
      ? camera.position.clone()
      : new Vector3(finalPosition[0], finalPosition[1], finalPosition[2]);
    const direction = new Vector3()
      .subVectors(toVec, currentTarget)
      .normalize();
    const finalDistance = currentTarget.distanceTo(toVec);
    const startDistance = finalDistance * 1.5; // farther but same angle
    const fromVec = new Vector3()
      .copy(currentTarget)
      .addScaledVector(direction, startDistance);

    camera.position.copy(fromVec);
    camera.lookAt(currentTarget);
    camera.updateProjectionMatrix();
    invalidate();

    fromRef.current = fromVec;
    toRef.current = toVec;
    localProgressRef.current = 0;
    startedRef.current = true;
    if (controlsRef?.current) controlsRef.current.enabled = false;
  }, [start, camera, invalidate, finalPosition]);

  useFrame((_, delta) => {
    if (!startedRef.current || doneRef.current) return;

    const duration = Math.max(0.001, durationSec);
    localProgressRef.current = Math.min(
      1,
      localProgressRef.current + delta / duration
    );
    const t = easeInOutCubic(localProgressRef.current);

    // Expose eased progress to parent if requested
    if (progressRef) progressRef.current = t;

    const from = fromRef.current;
    const to = toRef.current;
    if (!from || !to) return;

    camera.position.set(
      from.x + (to.x - from.x) * t,
      from.y + (to.y - from.y) * t,
      from.z + (to.z - from.z) * t
    );
    camera.lookAt(targetRef.current);

    if (localProgressRef.current >= 1) {
      camera.position.set(to.x, to.y, to.z);
      camera.lookAt(targetRef.current);
      doneRef.current = true;
      if (controlsRef?.current) controlsRef.current.enabled = true;
      if (progressRef) progressRef.current = 1;
    }

    invalidate();
  });

  return null;
};

const Computers = ({ isMobile, onFirstPrepared, dollyProgressRef }) => {
  const [visibleLayers] = useState(layerPaths.length);
  const groupRef = useRef();
  const { invalidate } = useThree();

  // Rotate city fast during dolly and ease to a slow continuous rotation
  useFrame((_, delta) => {
    const t = Math.min(1, Math.max(0, dollyProgressRef?.current ?? 1));
    const fastSpeedRadPerSec = 1; // fast rotation while dollying
    const slowSpeedRadPerSec = 0.02; // gentle rotation afterward
    const currentSpeed = fastSpeedRadPerSec * (1 - t) + slowSpeedRadPerSec * t;
    if (groupRef.current) {
      groupRef.current.rotation.y += currentSpeed * delta;
    }
    // Keep frames coming in demand mode while we rotate
    invalidate();
  });

  return (
    <mesh>
      <hemisphereLight intensity={4} groundColor="blue" />
      <spotLight
        position={[20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={2}
        castShadow
        shadow-mapSize={512}
      />
      <pointLight intensity={2} />

      <group
        ref={groupRef}
        scale={isMobile ? 0.7 : 1}
        position={isMobile ? [0, -3, -2.2] : [0, -3.25, -1.5]}
        rotation={[0, (Math.PI / 2) * 3, 0]} 
      >
        {layerPaths.slice(0, visibleLayers).map((path, index) => (
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

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const overlayStartRef = useRef(null);
  const [dollyStart, setDollyStart] = useState(false);
  const controlsRef = useRef(null);
  const dollyProgressRef = useRef(1); // eased progress of dolly [0..1]

  useEffect(() => {
    // Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    // Set the initial value of the `isMobile` state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    // Add the callback function as a listener for changes to the media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Remove the listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  const startOverlayFade = () => {
    if (overlayStartRef.current !== null) return;
    overlayStartRef.current = performance.now();
    const durationMs = 500;
    const step = (now) => {
      const elapsed = now - overlayStartRef.current;
      const t = Math.min(1, elapsed / durationMs);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setOverlayOpacity(1 - eased);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    setDollyStart(true);
  };

  return (
    <>
      <Canvas
        frameloop="demand"
        shadows
        dpr={[0.3, 0.7]}
        camera={{ position: [20, 3, 5], fov: 25 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
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
          <Computers
            isMobile={isMobile}
            onFirstPrepared={startOverlayFade}
            dollyProgressRef={dollyProgressRef}
          />
          <CameraDolly
            start={dollyStart}
            durationSec={3}
            finalPosition={[20, 3, 5]}
            controlsRef={controlsRef}
            progressRef={dollyProgressRef}
          />
        </Suspense>
      </Canvas>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "#0b0d12",
          pointerEvents: "none",
          opacity: overlayOpacity,
          zIndex: 9999,
        }}
      />
    </>
  );
};

// Optionally warm the GLTF cache for the first layer only
useGLTF.preload(layerPaths[0]);

export default ComputersCanvas;

/* Computers.propTypes = {
  isMobile: PropTypes.bool.isRequired,
}; */
