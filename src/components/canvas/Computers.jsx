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

const Computers = ({ isMobile, onFirstPrepared }) => {
  const [visibleLayers] = useState(layerPaths.length);

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
        scale={isMobile ? 0.7 : 0.75}
        position={isMobile ? [0, -3, -2.2] : [0, -3.25, -1.5]}
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
  };

  return (
    <>
      <Canvas
        frameloop="demand"
        shadows
        dpr={[0.6, 1]}
        camera={{ position: [20, 3, 5], fov: 25 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          {overlayOpacity === 0 && (
            <PerformanceMonitor onDecline={() => {}}>
              <AdaptiveDpr pixelated />
            </PerformanceMonitor>
          )}
          <Computers isMobile={isMobile} onFirstPrepared={startOverlayFade} />
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
