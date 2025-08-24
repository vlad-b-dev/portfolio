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
import { useInView } from "react-intersection-observer";
import CanvasLoader from "../Loader";

/* ---------- Constants ---------- */
const LAYER_PATHS = [
	"./city/city-layer-4.glb",
	"./city/city-layer-1.glb",
	"./city/city-layer-5.glb",
	"./city/city-layer-6.glb",
	"./city/city-layer-2.glb",
	"./city/city-layer-3.glb",
];

const FADE_DURATION = 1.2;
const DOLLY_DURATION = 4.5;
const OVERLAY_FADE_DURATION = 500;
const INITIAL_CAMERA_POSITION = [20, 3, 5];
const FINAL_CAMERA_POSITION = [20, 3, 5];
const DOLLY_START_MULTIPLIER = 1.5;
const ROTATION_SPEEDS = { fast: 1, slow: 0.025 };
const MOBILE_BREAKPOINT = 500;

const easeInOutSine = (x) => -(Math.cos(Math.PI * x) - 1) / 2;

/* ---------- CityLayer ---------- */
const CityLayer = ({ path, onPrepared }) => {
	const gltf = useGLTF(path);
	const materialsRef = useRef([]);
	const originalOpacityRef = useRef(new Map());
	const progressRef = useRef(0);
	const [prepared, setPrepared] = useState(false);
	const hasNotifiedRef = useRef(false);
	const { invalidate } = useThree();

	const processMaterials = useCallback(() => {
		materialsRef.current = [];
		originalOpacityRef.current.clear();

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
		if (prepared && onPrepared && !hasNotifiedRef.current) {
			hasNotifiedRef.current = true;
			onPrepared();
		}
	}, [prepared, onPrepared]);

	useFrame((_, delta) => {
		if (!prepared || progressRef.current >= 1) return;

		progressRef.current = Math.min(
			1,
			progressRef.current + delta / FADE_DURATION
		);
		const t = easeInOutSine(progressRef.current);

		materialsRef.current.forEach((material) => {
			const target = originalOpacityRef.current.get(material) || 1;
			material.opacity = target * t;
			if (progressRef.current >= 1 && target >= 1) {
				material.transparent = false;
			}
		});

		if (progressRef.current < 1) invalidate();
	});

	return <primitive object={gltf.scene} visible={prepared} />;
};

/* ---------- Camera Dolly ---------- */
const CameraDolly = ({
	start,
	durationSec = DOLLY_DURATION,
	finalPosition = FINAL_CAMERA_POSITION,
	controlsRef,
	progressRef,
	onFinish,
}) => {
	const { camera, invalidate } = useThree();
	const hasStartedRef = useRef(false);
	const isDoneRef = useRef(false);
	const fromRef = useRef(null);
	const toRef = useRef(null);
	const targetRef = useRef(new Vector3());
	const localProgressRef = useRef(0);

	const setupDolly = useCallback(() => {
		const currentTarget = controlsRef.current?.target?.clone() || new Vector3();
		targetRef.current.copy(currentTarget);

		const currentPos = controlsRef.current
			? camera.position.clone()
			: new Vector3(...finalPosition);

		const direction = new Vector3()
			.subVectors(currentPos, currentTarget)
			.normalize();
		const finalDistance = currentTarget.distanceTo(currentPos);
		const startDistance = finalDistance * DOLLY_START_MULTIPLIER;

		const fromVec = new Vector3()
			.copy(currentTarget)
			.addScaledVector(direction, startDistance);

		camera.position.copy(fromVec);
		camera.lookAt(currentTarget);
		camera.updateProjectionMatrix();

		fromRef.current = fromVec;
		toRef.current = currentPos;
		localProgressRef.current = 0;
		hasStartedRef.current = true;

		if (controlsRef.current) controlsRef.current.enabled = false;
		invalidate();
	}, [camera, controlsRef, finalPosition, invalidate]);

	useLayoutEffect(() => {
		if (start && !hasStartedRef.current && !isDoneRef.current) {
			setupDolly();
		}
	}, [start, setupDolly]);

	useFrame((_, delta) => {
		if (!hasStartedRef.current || isDoneRef.current) return;

		const duration = Math.max(0.001, durationSec);
		localProgressRef.current = Math.min(
			1,
			localProgressRef.current + delta / duration
		);
		const t = easeInOutSine(localProgressRef.current);

		if (progressRef) progressRef.current = t;

		if (fromRef.current && toRef.current) {
			camera.position.lerpVectors(fromRef.current, toRef.current, t);
			camera.lookAt(targetRef.current);
		}

		if (localProgressRef.current >= 1) {
			camera.position.copy(toRef.current);
			camera.lookAt(targetRef.current);
			isDoneRef.current = true;

			if (controlsRef.current) controlsRef.current.enabled = true;
			if (progressRef) progressRef.current = 1;

			if (onFinish) onFinish();
		}

		invalidate();
	});

	return null;
};

/* ---------- City ---------- */
const City = ({ isMobile, onFirstPrepared, dollyProgressRef }) => {
	const groupRef = useRef();
	const pointLightRef = useRef();
	const lightProgressRef = useRef(0);
	const { invalidate } = useThree();

	const mobileConfig = useMemo(
		() => ({
			scale: isMobile ? 1.1 : 1.6,
			position: isMobile ? [0, -3, -1] : [0, -4, -2.5],
			rotation: [0, (Math.PI / 2) * 3, 0],
		}),
		[isMobile]
	);

	useFrame((_, delta) => {
		if (pointLightRef.current && lightProgressRef.current < 1) {
			lightProgressRef.current = Math.min(
				1,
				lightProgressRef.current + delta / 12
			);
			pointLightRef.current.intensity =
				22 * easeInOutSine(lightProgressRef.current);
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
			<hemisphereLight intensity={0.8} groundColor="#84ffe9" />
			<spotLight
				angle={Math.PI}
				penumbra={5}
				intensity={30}
				castShadow
				color="#84ffe9"
				shadow-mapSize={14}
			/>
			<pointLight ref={pointLightRef} intensity={15} color="white" />

			<group ref={groupRef} {...mobileConfig}>
				{LAYER_PATHS.map((path, index) => (
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

/* ---------- CityCanvas ---------- */
const CityCanvas = () => {
	const [isMobile, setIsMobile] = useState(false);
	const [overlayOpacity, setOverlayOpacity] = useState(1);
	const [dollyStart, setDollyStart] = useState(false);
	const [hasPlayedIntro, setHasPlayedIntro] = useState(false);

	const overlayStartRef = useRef(null);
	const controlsRef = useRef(null);
	const dollyProgressRef = useRef(1);

	const { ref, inView } = useInView({
		threshold: 0.1,
		triggerOnce: false,
	});

	const mediaQuery = useMemo(
		() => window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`),
		[]
	);

	useEffect(() => {
		const handleChange = (e) => setIsMobile(e.matches);
		setIsMobile(mediaQuery.matches);
		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [mediaQuery]);

	const startOverlayFade = useCallback(() => {
		if (overlayStartRef.current !== null || hasPlayedIntro) return;

		overlayStartRef.current = performance.now();
		const step = (now) => {
			const t = Math.min(
				1,
				(now - overlayStartRef.current) / OVERLAY_FADE_DURATION
			);
			setOverlayOpacity(1 - easeInOutSine(t));
			if (t < 1) {
				requestAnimationFrame(step);
			}
		};

		requestAnimationFrame(step);
		setDollyStart(true);
	}, [hasPlayedIntro]);

	const overlayStyles = useMemo(
		() => ({
			position: "fixed",
			inset: 0,
			background: "#0b0d12",
			pointerEvents: "none",
			opacity: overlayOpacity,
			zIndex: 9999,
		}),
		[overlayOpacity]
	);

	return (
		<div ref={ref} style={{ height: "100vh", width: "100%" }}>
			<Canvas
				frameloop={inView ? "always" : "never"}
				shadows
				dpr={[0.5, 0.9]}
				camera={{ position: INITIAL_CAMERA_POSITION, fov: 25 }}
				gl={{ antialias: true, powerPreference: "high-performance" }}
			>
				<Suspense fallback={<CanvasLoader />}>
					<OrbitControls
						ref={controlsRef}
						enableZoom={false}
						maxPolarAngle={isMobile ? Math.PI / 2.2 : Math.PI / 1.97}
						minPolarAngle={isMobile ? Math.PI / 2.2 : Math.PI / 1.97}
					/>
					{overlayOpacity === 0 && (
						<PerformanceMonitor>
							<AdaptiveDpr pixelated />
						</PerformanceMonitor>
					)}
					<City
						isMobile={isMobile}
						onFirstPrepared={startOverlayFade}
						dollyProgressRef={dollyProgressRef}
					/>
					{!hasPlayedIntro && (
						<CameraDolly
							start={dollyStart}
							durationSec={DOLLY_DURATION}
							finalPosition={FINAL_CAMERA_POSITION}
							controlsRef={controlsRef}
							progressRef={dollyProgressRef}
							onFinish={() => setHasPlayedIntro(true)}
						/>
					)}
				</Suspense>
			</Canvas>
			{overlayOpacity > 0 && <div style={overlayStyles} />}
		</div>
	);
};

useGLTF.preload(LAYER_PATHS[0]);

export default CityCanvas;
