import React, { useRef, useEffect, useMemo } from "react";
import { SectionWrapper } from "../hoc";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { habilities } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = ({ index, title, icon }) => {
	const ringRef = useRef(null);
	const lightRef = useRef(null);

	const maskThreshold = useMemo(
		() => (window.innerWidth < 640 ? "65%" : "50%"),
		[],
	);

	useEffect(() => {
		if (window.innerWidth < 640) return; // skip mobile

		const el = ringRef.current;
		const light = lightRef.current;
		if (!el || !light) return;

		let pos = { x: 50, y: 50 };
		let frame;

		const handleMouseMove = (e) => {
			const rect = el.getBoundingClientRect();
			pos.x = ((e.clientX - rect.left) / rect.width) * 100;
			pos.y = ((e.clientY - rect.top) / rect.height) * 100;

			if (!frame) {
				frame = requestAnimationFrame(() => {
					light.style.background = `radial-gradient(600px 600px at ${pos.x}% ${pos.y}%, rgba(132,255,233,0.55) 0%, rgba(132,255,233,0.25) 35%, rgba(132,255,233,0) 70%)`;
					frame = null;
				});
			}
		};

		window.addEventListener("mousemove", handleMouseMove, { passive: true });
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, [maskThreshold]);

	return (
		<Tilt
			className="flex justify-center"
			tiltMaxAngleX={25}
			tiltMaxAngleY={25}
			perspective={1200}
			scale={1.1}
			transitionSpeed={1000}
		>
			<motion.div
				ref={ringRef}
				variants={fadeIn("right", "spring", index * 0.5, 0.75)}
				className="relative p-[3px] rounded-full bg-tertiary overflow-visible"
			>
				<span
					ref={lightRef}
					className="pointer-events-none absolute inset-0 rounded-full"
					style={{
						background: `radial-gradient(600px 600px at 50% 50%, rgba(132,255,233,0.55) 0%, rgba(132,255,233,0.25) 35%, rgba(132,255,233,0) 70%)`,
						maskImage: `radial-gradient(circle at center, transparent ${maskThreshold}, white ${maskThreshold})`,
						WebkitMaskImage: `radial-gradient(circle at center, transparent ${maskThreshold}, white ${maskThreshold})`,
						transition: "background 80ms linear",
					}}
				/>

				<div
					className="bg-secondary rounded-full sm:w-[15vw] sm:h-[15vw] w-[40vw] h-[40vw] flex justify-center items-center flex-col
            shadow-[0_30px_40px_rgba(0,0,0,0.9),inset_0_12px_18px_rgba(0,0,0,0.3),inset_0_-12px_18px_rgba(0,0,0,0.3)]
            transition-shadow duration-300"
				>
					<h3 className="text-white text-xs font-bold text-center">{title}</h3>
					<img
						src={icon}
						alt="web-development"
						className="w-10 h-10 object-contain mt-4"
					/>
				</div>
			</motion.div>
		</Tilt>
	);
};

const About = () => (
	<>
		<motion.div variants={textVariant()}>
			<p className={styles.sectionSubText}>Introduction</p>
			<h2 className={styles.sectionHeadText}>
				<span className="text-tertiary">_</span>Summary
			</h2>
		</motion.div>

		<motion.p
			variants={fadeIn("", "", 0.1, 1)}
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
			{habilities.map((service, index) => (
				<ServiceCard key={service.title} index={index} {...service} />
			))}
		</div>
	</>
);

export default SectionWrapper(About, "about");
