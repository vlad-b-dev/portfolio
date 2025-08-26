import React, { useRef, useEffect, useMemo, useState } from "react";
import { SectionWrapper } from "../hoc";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { habilities } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const HabilityCard = React.forwardRef(({ index, title, icon, triggerAll }, externalRef) => {
	const ringRef = useRef(null);
	const lightRef = useRef(null);

	const maskThreshold = useMemo(
		() => (window.innerWidth < 640 ? "70%" : "43%"),
		[]
	);

	const pos = useRef({ x: 50, y: 50 });
	const target = useRef({ x: 50, y: 50 });

	useEffect(() => {
		if (window.innerWidth < 640) return;

		const el = ringRef.current;
		const light = lightRef.current;
		if (!el || !light) return;

		let frame;
		const lerp = (a, b, t) => a + (b - a) * t;
		const speed = 0.15;

		const handleMouseMove = (e) => {
			const rect = el.getBoundingClientRect();
			target.current.x = ((e.clientX - rect.left) / rect.width) * 100;
			target.current.y = ((e.clientY - rect.top) / rect.height) * 100;

			if (!frame) frame = requestAnimationFrame(update);
		};

		const update = () => {
			pos.current.x = lerp(pos.current.x, target.current.x, speed);
			pos.current.y = lerp(pos.current.y, target.current.y, speed);

			if (
				Math.abs(pos.current.x - target.current.x) > 0.1 ||
				Math.abs(pos.current.y - target.current.y) > 0.1
			) {
				light.style.background = `radial-gradient(600px 600px at ${pos.current.x}% ${pos.current.y}%, rgba(132,255,233,0.55) 0%, rgba(132,255,233,0.25) 35%, rgba(132,255,233,0) 70%)`;
				frame = requestAnimationFrame(update);
			} else {
				frame = null;
			}
		};

		window.addEventListener("mousemove", handleMouseMove, { passive: true });
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	useEffect(() => {
		if (externalRef && typeof externalRef === "object" && externalRef !== null) {
			externalRef.current = ringRef.current;
		}
	}, [externalRef]);

	return (
		<Tilt
			className="flex flex-col justify-center items-center"
			tiltMaxAngleX={30}
			tiltMaxAngleY={30}
			perspective={1200}
			scale={1.1}
			transitionSpeed={1000}
		>
			<motion.div
				ref={ringRef}
				variants={fadeIn("right", "spring", index * 0.5, 0.75)}
				initial="hidden"
				animate={triggerAll ? "show" : undefined}
				whileInView={!triggerAll ? "show" : undefined}
				viewport={{ once: true, amount: 0.05 }}
				className="flex flex-col items-center"
			>
				<h3 className="text-white text-xs sm:text-base font-bold text-center min-h-[3.5rem] flex items-center">
					{title}
				</h3>

				<div className="relative p-[3px] rounded-full bg-tertiary overflow-visible">
					<span
						ref={lightRef}
						className="pointer-events-none absolute inset-0 rounded-full"
						style={{
							background: `radial-gradient(600px 600px at 5% 5%, rgba(132,255,233,0.55) 0%, rgba(132,255,233,0.25) 35%, rgba(132,255,233,0) 70%)`,
							maskImage: `radial-gradient(circle at center, transparent ${maskThreshold}, white ${maskThreshold})`,
							WebkitMaskImage: `radial-gradient(circle at center, transparent ${maskThreshold}, white ${maskThreshold})`,
							transition: "background 80ms linear",
						}}
					/>

					<div
						className="bg-primary rounded-full sm:w-[15vw] sm:h-[15vw] w-[40vw] h-[40vw] flex justify-center items-center
              shadow-[0_30px_40px_rgba(0,0,0,0.9),inset_0_12px_18px_rgba(0,0,0,0.3),inset_0_-12px_18px_rgba(0,0,0,0.3)]
              transition-shadow duration-300"
					>
						<img
							src={icon}
							alt={title}
							className="sm:w-32 sm:h-32 w-[32vw] h-[32vw] object-contain z-50"
						/>
					</div>
				</div>
			</motion.div>
		</Tilt>
	);
});

const About = () => {
	const isMobile = useMemo(() => window.innerWidth < 640, []);
	const firstCardRef = useRef(null);
	const [triggerAll, setTriggerAll] = useState(false);

	useEffect(() => {
		if (isMobile || !firstCardRef.current) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setTriggerAll(true);
				}
			},
			{ threshold: 0.25 }
		);

		observer.observe(firstCardRef.current);

		return () => observer.disconnect();
	}, [isMobile]);

	return (
		<>
			<motion.div
				variants={textVariant()}
				initial="hidden"
				whileInView="show"
				viewport={{ once: true, amount: 0.25 }}
			>
				<p className={styles.sectionSubText}>Introduction</p>
				<h2 className={styles.sectionHeadText}>
					<span className="text-tertiary">_</span>Summary
				</h2>
			</motion.div>

			<motion.p
				variants={fadeIn("", "", 0.1, 1)}
				initial="hidden"
				whileInView="show"
				viewport={{ once: true, amount: 0.25 }}
				className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
			>
				I’m a software developer and UX/UI expert with experience in Industry 4.0
				solutions. Skilled in TypeScript, JavaScript, Java and Python, I work with
				frameworks like Angular, React, and Spring Boot to build scalable,
				user-friendly applications. By combining technical expertise with design
				skills, I create innovative and reliable software tailored to real-world
				needs.
			</motion.p>

			<div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-x-5 gap-y-10">
				{habilities.map((hability, index) => (
					<HabilityCard
						key={hability.title}
						index={index}
						{...hability}
						triggerAll={isMobile ? undefined : triggerAll}
						ref={!isMobile && index === 0 ? firstCardRef : null}
					/>
				))}
			</div>
		</>
	);
};

export default SectionWrapper(About, "about");
