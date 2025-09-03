import React, {
  Suspense,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useState,
} from "react";
import { Canvas, useFrame, useThree, invalidate } from "@react-three/fiber";
import {
  OrbitControls,
  Preload,
  useGLTF,
  useAnimations,
  AdaptiveDpr,
  PerformanceMonitor,
} from "@react-three/drei";
import { useInView } from "react-intersection-observer";
import CanvasLoader from "../Loader";

/* ------------------ Earth ------------------ */
const Earth = React.memo(function Earth({ active }) {
  const earth = useGLTF("./earth/scene.glb");
  const { actions, mixer } = useAnimations(earth.animations, earth.scene);

  const groupRef = useRef();
  const mainLightRef = useRef();
  const oceanLightRef = useRef();

  const mainColor = "#84ffe9";
  const meshColors = useMemo(
    () => ({
      TERRE1_0: "#00ffae",
      "Circle.643_0": "#00ffae",
      Sphere: "#84afc4",
      Circle_0: "#00ffae",
    }),
    []
  );

  const appearRef = useRef(0);
  const targetPowerRef = useRef(1);
  const powerRef = useRef(1);
  const holdTimerRef = useRef(0);
  const introDoneRef = useRef(false);
  const tabHiddenRef = useRef(false);

  const meshes = useMemo(() => {
    const list = [];
    earth.scene.traverse((child) => {
      if (child.isMesh) list.push(child);
    });
    return list;
  }, [earth.scene]);

  useEffect(() => {
    if (actions["Take 01"]) {
      actions["Take 01"].reset().fadeIn(0.5).play();
      mixer.timeScale = 0.3;
    }

    meshes.forEach((mesh) => {
      mesh.material = mesh.material.clone();
      mesh.material.color.set(mainColor);

      if (mesh.material.emissive) {
        const named = meshColors[mesh.name];
        mesh.material.emissive.set(named ? named : mainColor);
        mesh.material.emissiveIntensity = 0.0;
      }

      mesh.material.transparent = true;
      mesh.material.opacity = 0.0;
      mesh.material.depthWrite = false;
      mesh.material.side = 2;
      mesh.frustumCulled = true;
    });
  }, [actions, mixer, meshes, meshColors, mainColor]);

  const { gl } = useThree();
  useEffect(() => {
    const el = gl.domElement;
    const prevImageRendering = el.style.imageRendering;
    const prevFilter = el.style.filter;

    el.style.imageRendering = "pixelated";
    el.style.filter = "contrast(1.3) brightness(0.75) saturate(2)";

    return () => {
      el.style.imageRendering = prevImageRendering;
      el.style.filter = prevFilter;
    };
  }, [gl]);

  useEffect(() => {
    const onVis = () => {
      tabHiddenRef.current = document.hidden;
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useFrame((_, delta) => {
    if (!active || tabHiddenRef.current) return;

    if (!introDoneRef.current) {
      appearRef.current = Math.min(1, appearRef.current + 0.02);
      if (groupRef.current) {
        const s = 0.8 + (1.2 - 0.8) * appearRef.current;
        groupRef.current.scale.setScalar(s);
      }
      if (appearRef.current >= 1) {
        introDoneRef.current = true;
      }
    }

    if (introDoneRef.current) {
      if (holdTimerRef.current <= 0 && Math.random() < 0.0025) {
        targetPowerRef.current = 0.15 + Math.random() * 0.25;
        holdTimerRef.current = 0.6 + Math.random() * 0.5;
      }

      if (holdTimerRef.current > 0) {
        holdTimerRef.current -= delta;
      } else if (targetPowerRef.current !== 1) {
        targetPowerRef.current = 1;
      }
    }

    powerRef.current = powerRef.current * 0.85 + targetPowerRef.current * 0.15;
    const powerLevel = powerRef.current;
    const appear = appearRef.current;

    const baseOpacity = 0.1 + 0.45 * appear;
    const emissiveTargetBase = (0.6 * powerLevel + 0.2) * appear;

    for (let i = 0; i < meshes.length; i++) {
      const m = meshes[i].material;
      m.opacity = m.opacity * 0.85 + baseOpacity * powerLevel * 0.15;

      if (m.emissiveIntensity !== undefined) {
        m.emissiveIntensity =
          m.emissiveIntensity * 0.85 + emissiveTargetBase * 0.15;
      }
    }

    if (oceanLightRef.current) {
      const t = 0.025 * powerLevel * appear;
      oceanLightRef.current.intensity =
        oceanLightRef.current.intensity * 0.85 + t;
    }
    if (mainLightRef.current) {
      const t = 0.035 * powerLevel * appear;
      mainLightRef.current.intensity =
        mainLightRef.current.intensity * 0.85 + t;
    }

    invalidate();
  });

  return (
    <group ref={groupRef}>
      <primitive object={earth.scene} position-y={0} rotation-y={0} />
      <directionalLight
        ref={mainLightRef}
        position={[5, 5, 5]}
        intensity={0.0}
        color={mainColor}
      />
      <pointLight
        ref={oceanLightRef}
        position={[-5, -3, -5]}
        intensity={0.0}
        color={mainColor}
      />
      <pointLight position={[0, 10, 0]} intensity={0.0} color={mainColor} />
    </group>
  );
});

/* ------------------ Earth Canvas ------------------ */
const EarthCanvas = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const [sceneActive, setSceneActive] = useState(false);
  const onCreated = useCallback(() => {
    requestAnimationFrame(() => setSceneActive(true));
  }, []);

  const isMobile = useMemo(() => window.innerWidth < 640, []);

  return (
    <div
      ref={ref}
      style={{ height: "100vh", width: "100%", position: "relative", top: isMobile ? "-19vh" : "0" }}
    >
      {inView && (
        <Canvas
          frameloop="demand"
          shadows={false}
          dpr={[0.5, 1]}
          camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [-4, 3, 6],
          }}
          gl={{
            antialias: true,
            powerPreference: "low-power",
          }}
          onCreated={onCreated}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={<CanvasLoader />}>
            <group scale={isMobile ? 0.5 : 1} position={[0, 0.7, 0]}>
              <OrbitControls
                autoRotate
                autoRotateSpeed={0.5}
                enableZoom={false}
                enableRotate
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 2}
                rotateSpeed={1}
                dampingFactor={0.02}
                enableDamping
              />
              <PerformanceMonitor>
                <AdaptiveDpr pixelated />
              </PerformanceMonitor>
              <Earth active={sceneActive} />
            </group>
            <Preload all />
          </Suspense>
        </Canvas>
      )}

      {isMobile && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            background: "transparent",
            height: "95%",
            top: "0",
          }}
        />
      )}
    </div>
  );
};

useGLTF.preload("./earth/scene.glb");

export default EarthCanvas;
