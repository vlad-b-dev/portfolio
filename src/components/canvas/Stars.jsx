import React, {
	useRef,
	Suspense,
	useEffect,
	useState,
	useCallback,
	useMemo,
} from "react";
import { Canvas, useFrame, invalidate } from "@react-three/fiber";
import {
	Points,
	PointMaterial,
	Preload,
	AdaptiveDpr,
	PerformanceMonitor,
} from "@react-three/drei";
import { useInView } from "react-intersection-observer";
import * as random from "maath/random/dist/maath-random.esm";

/* ------------------ Stars ------------------ */
const Stars = React.memo(function Stars() {
	const ref = useRef();
	const positions = useRef(
		random.inSphere(new Float32Array(5000), { radius: 1.2 })
	);
	const tabHiddenRef = useRef(false);

	useEffect(() => {
		const onVis = () => {
			tabHiddenRef.current = document.hidden;
		};
		document.addEventListener("visibilitychange", onVis);
		return () => document.removeEventListener("visibilitychange", onVis);
	}, []);

	useFrame((_, delta) => {
		if (tabHiddenRef.current || !ref.current) return;
		ref.current.rotation.x -= delta / 40;
		ref.current.rotation.y -= delta / 45;

		// trigger re-render since we use frameloop="demand"
		invalidate();
	});

	return (
		<group rotation={[0, 0, Math.PI / 4]}>
			<Points ref={ref} positions={positions.current} stride={3} frustumCulled>
				<PointMaterial
					transparent
					color="#84ffe9"
					size={0.002}
					sizeAttenuation
					depthWrite={false}
				/>
			</Points>
		</group>
	);
});

/* ------------------ Stars Canvas ------------------ */
const StarsCanvas = () => {
	const { ref, inView } = useInView({
		threshold: 0.1,
		triggerOnce: false,
	});

	const [sceneActive, setSceneActive] = useState(false);
	const onCreated = useCallback(() => {
		requestAnimationFrame(() => setSceneActive(true));
	}, []);

	// detect mobile once
	const isMobile = useMemo(() => window.innerWidth < 640, []);

	return (
		<div ref={ref} className="w-full h-auto absolute inset-0 z-[-1]">
			{inView && (
				<Canvas
					camera={{ position: [0, 0, 1] }}
					frameloop="demand"
					dpr={[0.5, 1]}
					gl={{ powerPreference: "low-power" }}
					onCreated={onCreated}
				>
					<Suspense fallback={null}>
						<PerformanceMonitor>
							<AdaptiveDpr pixelated />
						</PerformanceMonitor>

						{/* scale scene based on device */}
						<group scale={isMobile ? 0.5 : 1}>
							<Stars active={sceneActive} />
						</group>

						<Preload all />
					</Suspense>
				</Canvas>
			)}
		</div>
	);
};

export default StarsCanvas;
