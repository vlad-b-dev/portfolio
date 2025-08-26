import React, { Suspense, useEffect, useRef, useMemo, useCallback, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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

  // ---- Animation state kept in refs (no React re-renders per frame) ----
  const appearRef = useRef(0);
  const targetPowerRef = useRef(1);
  const powerRef = useRef(1);
  const holdTimerRef = useRef(0);
  const introDoneRef = useRef(false);
  const tabHiddenRef = useRef(false);

  // Cache meshes once for faster per-frame updates
  const meshes = useMemo(() => {
    const list = [];
    earth.scene.traverse((child) => {
      if (child.isMesh) list.push(child);
    });
    return list;
  }, [earth.scene]);

  // Prepare materials once
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

  // Apply the hologram CSS filter once (not every frame)
  const { gl } = useThree();
  useEffect(() => {
    const el = gl.domElement;
    const prevImageRendering = el.style.imageRendering;
    const prevFilter = el.style.filter;

    el.style.imageRendering = "pixelated";
    el.style.filter = "contrast(0.9) brightness(0.9) saturate(1.6)";

    return () => {
      el.style.imageRendering = prevImageRendering;
      el.style.filter = prevFilter;
    };
  }, [gl]);

  // Pause animations when tab is hidden
  useEffect(() => {
    const onVis = () => {
      tabHiddenRef.current = document.hidden;
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Core per-frame loop (skips when inactive/offscreen/hidden)
  useFrame((_, delta) => {
    if (!active || tabHiddenRef.current) return;

    // --- Appear animation (runs once until done) ---
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

    // --- Flicker only after appear completed ---
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

    // Smooth power interpolation (works during and after appear)
    powerRef.current = powerRef.current * 0.85 + targetPowerRef.current * 0.15;
    const powerLevel = powerRef.current;
    const appear = appearRef.current;

    // Update materials
    const baseOpacity = 0.1 + 0.45 * appear;
    const emissiveTargetBase = (0.6 * powerLevel + 0.2) * appear;

    for (let i = 0; i < meshes.length; i++) {
      const m = meshes[i].material;
      m.opacity = m.opacity * 0.85 + baseOpacity * powerLevel * 0.15;

      if (m.emissiveIntensity !== undefined) {
        m.emissiveIntensity = m.emissiveIntensity * 0.85 + emissiveTargetBase * 0.15;
      }
    }

    // Lights follow power/appear
    if (oceanLightRef.current) {
      const t = (0.25 * powerLevel * appear) * 0.1;
      oceanLightRef.current.intensity = oceanLightRef.current.intensity * 0.85 + t;
    }
    if (mainLightRef.current) {
      const t = (0.35 * powerLevel * appear) * 0.1;
      mainLightRef.current.intensity = mainLightRef.current.intensity * 0.85 + t;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={earth.scene} position-y={0} rotation-y={0} />
      <directionalLight ref={mainLightRef} position={[5, 5, 5]} intensity={0.0} color={mainColor} />
      <pointLight ref={oceanLightRef} position={[-5, -3, -5]} intensity={0.0} color={mainColor} />
      <pointLight position={[0, 10, 0]} intensity={0.0} color={mainColor} />
    </group>
  );
});

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
    <div ref={ref} style={{ height: "100vh", width: "100%" }}>
      <Canvas
        frameloop={inView ? "always" : "never"}
        shadows
        dpr={[0.75, 1.5]}
        camera={{ fov: 45, near: 0.1, far: 200, position: [-4, 3, 6] }}
        gl={{ antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: true }}
        onCreated={onCreated}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls
            autoRotate
            autoRotateSpeed={0.25}
            enableZoom={false}
            enableRotate
            maxPolarAngle={Math.PI}
            minPolarAngle={0}
            rotateSpeed={1.5}
            dampingFactor={0.01}
            enableDamping
          />

          {inView && (
            <PerformanceMonitor>
              <AdaptiveDpr pixelated />
            </PerformanceMonitor>
          )}

          <Earth active={inView && sceneActive} />

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};

useGLTF.preload("./earth/scene.glb");

export default EarthCanvas;
