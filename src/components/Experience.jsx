import React, { memo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { professionalProjects, acomplishedProjects, activeProjects } from "../constants";
import ExperienceDisplay from "./ExperienceDisplay";
import { github } from "../assets";

const isMobile = /Mobi|Android/i.test(navigator.userAgent);

// -------------------- Improved Fade In --------------------
const fadeInWeighted = (direction = "up", delay = 0) => {
	const distance = 90;
	return {
		hidden: {
			opacity: 0,
			y: direction === "up" ? distance : -distance,
			scale: 0.98
		},
		show: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				type: "spring",
				stiffness: 85,
				damping: 18,
				mass: 1,
				delay,
			},
		},
	};
};

// -------------------- Text Variant --------------------
const textVariant = (delay = 0) => ({
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			type: "spring",
			stiffness: 80,
			damping: 16,
			delay,
		},
	},
});

// -------------------- Project Card --------------------
const ProjectCard = memo(({ index, ...project }) => {
	const content = <ProjectContent {...project} />;

	const delay = index === 0 ? 0.3 : index * 0.65;

	return (
		<motion.div
			variants={fadeInWeighted("up", delay)}
			initial="hidden"
			whileInView="show"
			viewport={{ once: true, amount: 0.2 }}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.97 }}
		>
			{isMobile ? (
				<MobileTiltWrapper>{content}</MobileTiltWrapper>
			) : (
				<Tilt
					tiltMaxAngleX={17}
					tiltMaxAngleY={15}
					scale={1.04}
					transitionSpeed={300}
					gyroscope={false}
					className="bg-primary p-5 rounded-2xl w-full h-full shadow-lg shadow-black/30 hover:shadow-2xl hover:shadow-black/50 transition-shadow duration-300 border-2 border-tertiary"
				>
					{content}
				</Tilt>
			)}
		</motion.div>
	);
});

// -------------------- Mobile Tilt Wrapper --------------------
const MobileTiltWrapper = ({ children }) => {
	const [rotation, setRotation] = useState({ x: 0, y: 0 });
	const handleMove = useCallback((e) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const clientX = e.touches?.[0]?.clientX ?? e.clientX;
		const clientY = e.touches?.[0]?.clientY ?? e.clientY;

		const x = (clientX - rect.left) / rect.width - 0.35;
		const y = (clientY - rect.top) / rect.height - 0.35;

		setRotation({ x: y * 45, y: x * -45 });
	}, []);

	const handleLeave = useCallback(() => setRotation({ x: 0, y: 0 }), []);

	const shadowStyle = {
		boxShadow: `${-rotation.y / 2}px ${rotation.x / 2}px 30px rgba(0,0,0,0.9)`,
		transformStyle: "preserve-3d",
	};

	return (
		<motion.div
			onMouseMove={handleMove}
			onMouseLeave={handleLeave}
			onTouchMove={handleMove}
			onTouchEnd={handleLeave}
			animate={{ rotateX: rotation.x, rotateY: rotation.y }}
			transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
			style={shadowStyle}
			className="bg-primary p-5 rounded-2xl w-full h-full border-2 border-tertiary"
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.97 }}
		>
			{children}
		</motion.div>
	);
};

// -------------------- Project Content --------------------
const ProjectContent = ({ name, description, tags, image, source_code_link, link }) => (
	<>
		<div className="relative w-full h-[230px]">
			<img src={image} alt={name} className="w-full h-full object-cover rounded-2xl" loading="lazy" />
			{(source_code_link || link) && (
				<div className="absolute inset-0 flex justify-end m-3 card-img_hover gap-2">
					{source_code_link && (
						<button
							onClick={() => window.open(source_code_link, "_blank")}
							className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
							aria-label={`View ${name} source code`}
						>
							<img src={github} alt="GitHub" className="w-1/2 h-1/2 object-contain" loading="lazy" />
						</button>
					)}
					{link && (
						<button
							onClick={() => window.open(link, "_blank")}
							className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
							aria-label={`Open ${name} live site`}
						>
							<span className="text-white text-[16px] font-bold">↗</span>
						</button>
					)}
				</div>
			)}
		</div>

		<div className="mt-5">
			<h3 className="text-white font-bold text-[18px] sm:text-[22px]">{name}</h3>
			<p className="mt-2 text-secondary text-[14px] leading-relaxed">{description}</p>
		</div>

		<div className="mt-4 flex flex-wrap gap-2">
			{tags.map((tag) => (
				<span key={`${name}-${tag.name}`} className={`text-[13px] sm:text-[14px] ${tag.color}`}>
					#{tag.name}
				</span>
			))}
		</div>
	</>
);

// -------------------- Experience Block --------------------
const ExperienceBlock = ({ title, duration, description, projects }) => (
	<div className="mt-4 blue-green-gradient rounded-[20px]">
		<div className="bg-black-100 rounded-2xl sm:px-16 px-6 sm:pt-8 sm:pb-16 py-10 sm:min-h-[45vh] min-h-[57vh]">
			<motion.div variants={textVariant()} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
				<h2 className={styles.porfolioHeadText}>{title}</h2>
				<p className={styles.porfolioExperience}>{duration}</p>
				<p className="text-secondary text-[14px] leading-[30px]">{description}</p>
			</motion.div>
		</div>
		<div className="-mt-16 pb-14 sm:px-8 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{projects}
		</div>
	</div>
);

// -------------------- Main Experience --------------------
const Experience = () => {
	const renderProjects = useCallback((projects) =>
		projects.map((p, i) => <ProjectCard key={`project-${i}`} index={i} {...p} />),
		[]
	);

	return (
		<>
			<SectionHeader subText="Projects" headText="_Professional" />
			<ExperienceBlock title="Zeo Technology" duration="3 years 8 months"
				description="A global Industry 4.0 pioneer, blending agility and innovation to transform manufacturing. Recognized worldwide as a leader in MES systems, and trusted by industry leaders including Cinfa, Florette, and Onnera"
				projects={renderProjects(professionalProjects)}
			/>
			<SectionHeader subText="Projects" headText="_Personal" className="mt-16" />
			<ExperienceBlock
				title="Accomplished"
				duration="7 months"
				description="Includes a few completed projects that are no longer under active development, but are maintained and updated as needed"
				projects={renderProjects(acomplishedProjects)}
			/>
			<ExperienceBlock
				title="Active and planned"
				duration="3 months"
				description="Features projects under active development or planned for near- to mid-term completion. Only completed experience is listed above"
				projects={renderProjects(activeProjects)}
			/>
			<ExperienceDisplay years={4} months={6} duration={3000} />
		</>
	);
};

// -------------------- Section Header --------------------
const SectionHeader = ({ subText, headText, className = "" }) => (
	<motion.div variants={textVariant()} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className={className}>
		<p className={styles.sectionSubText}>{subText}</p>
		<h2 className={styles.sectionHeadText}>
			<span className="text-tertiary">{headText[0]}</span>
			{headText.slice(1)}
		</h2>
	</motion.div>
);

export default SectionWrapper(Experience, "");
