import React, { useRef, Suspense, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
	Points,
	PointMaterial,
	Preload,
	AdaptiveDpr,
	PerformanceMonitor,
} from "@react-three/drei";
import { useInView } from "react-intersection-observer";
import * as random from "maath/random/dist/maath-random.esm";

const Stars = React.memo(function Stars(props) {
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
		if (tabHiddenRef.current) return;
		if (ref.current) {
			ref.current.rotation.x -= delta / 10;
			ref.current.rotation.y -= delta / 15;
		}
	});

	return (
		<group rotation={[0, 0, Math.PI / 4]}>
			<Points ref={ref} positions={positions.current} stride={3} frustumCulled {...props}>
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

const StarsCanvas = () => {
	const { ref, inView } = useInView({
		threshold: 0.1,
		triggerOnce: false,
	});

	const [sceneActive, setSceneActive] = useState(false);
	const onCreated = useCallback(() => {
		requestAnimationFrame(() => setSceneActive(true));
	}, []);

	return (
		<div ref={ref} className="w-full h-auto absolute inset-0 z-[-1]">
			<Canvas
				camera={{ position: [0, 0, 1] }}
				frameloop={inView ? "always" : "never"}
				dpr={[0.75, 1.5]}
				onCreated={onCreated}
			>
				<Suspense fallback={null}>
					{inView && (
						<PerformanceMonitor>
							<AdaptiveDpr pixelated />
						</PerformanceMonitor>
					)}

					<Stars active={inView && sceneActive} />

					<Preload all />
				</Suspense>
			</Canvas>
		</div>
	);
};

export default StarsCanvas;
