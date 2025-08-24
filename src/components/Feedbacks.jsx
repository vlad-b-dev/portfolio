import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { projects } from "../constants";
import { github } from "../assets";

// Helper: detect mobile/touch device
const isMobile = typeof window !== "undefined" && "ontouchstart" in window;

const ProjectCard = memo(({ index, name, description, tags, image, source_code_link }) => {
	return (
		<motion.div
			variants={fadeIn("up", "spring", index * 0.5, 0.75)}
			initial="hidden"
			whileInView="show"
			viewport={{ once: true, amount: 0.2 }} // 👈 animate once only
		>
			{isMobile ? (
				/* No tilt on mobile for smoother performance */
				<div className="bg-primary p-5 rounded-2xl sm:w-[360px] w-full">
					<ProjectContent
						name={name}
						description={description}
						tags={tags}
						image={image}
						source_code_link={source_code_link}
					/>
				</div>
			) : (
				<Tilt
					tiltMaxAngleX={15}
					tiltMaxAngleY={15}
					transitionSpeed={300}
					scale={1}
					gyroscope={true}
					className="bg-primary p-5 rounded-2xl sm:w-[360px] w-full"
				>
					<ProjectContent
						name={name}
						description={description}
						tags={tags}
						image={image}
						source_code_link={source_code_link}
					/>
				</Tilt>
			)}
		</motion.div>
	);
});

// Extracted content so we can reuse inside Tilt or plain div
const ProjectContent = ({ name, description, tags, image, source_code_link }) => (
	<>
		<div className="relative w-full h-[230px]">
			<img
				src={image}
				alt={name}
				className="w-full h-full object-cover rounded-2xl"
				loading="lazy"
			/>
			<div className="absolute inset-0 flex justify-end m-3 card-img_hover">
				<button
					onClick={() => window.open(source_code_link, "_blank")}
					className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
					aria-label={`View ${name} source code`}
				>
					<img
						src={github}
						alt="GitHub"
						className="w-1/2 h-1/2 object-contain"
						loading="lazy"
					/>
				</button>
			</div>
		</div>

		<div className="mt-5">
			<h3 className="text-white font-bold text-[20px] sm:text-[24px]">{name}</h3>
			<p className="mt-2 text-secondary text-[14px] leading-relaxed">{description}</p>
		</div>

		<div className="mt-4 flex flex-wrap gap-2">
			{tags.map((tag) => (
				<span
					key={`${name}-${tag.name}`}
					className={`text-[13px] sm:text-[14px] ${tag.color}`}
				>
					#{tag.name}
				</span>
			))}
		</div>
	</>
);

const Feedbacks = () => {
	// Memoize project rendering for perf
	const renderedProjects = useMemo(
		() =>
			projects.map((project, index) => (
				<ProjectCard key={`project-${index}`} index={index} {...project} />
			)),
		[]
	);

	return (
		<>
			<motion.div
				variants={textVariant()}
				initial="hidden"
				whileInView="show"
				viewport={{ once: true, amount: 0.2 }} // 👈 animate once only
			>
				<p className={styles.sectionSubText}>Professional career</p>
				<h2 className={styles.sectionHeadText}>
					<span className="text-tertiary">_</span>Portfolio
				</h2>
			</motion.div>

			<div className="mt-12 blue-green-gradient rounded-[20px]">
				<div className={`bg-black-100 rounded-2xl ${styles.padding} min-h-[40vh]`}>
					<motion.div
						variants={textVariant()}
						initial="hidden"
						whileInView="show"
						viewport={{ once: true, amount: 0.2 }} // 👈 animate once only
					>
						<h2 className={styles.porfolioHeadText}>Zeo Technology</h2>
						<p className={styles.porfolioSubText}>Main projects</p>
					</motion.div>
				</div>

				<div className="-mt-16 pb-14 sm:px-8 px-4 flex flex-wrap gap-5 justify-center">
					{renderedProjects}
				</div>
			</div>
		</>
	);
};

export default SectionWrapper(Feedbacks, "");
