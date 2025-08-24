import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { projects } from "../constants";
import { github } from "../assets";

const ProjectCard = memo(
	({ index, name, description, tags, image, source_code_link }) => {
		return (
			<motion.div
				variants={fadeIn("up", "spring", index * 0.5, 0.75)}
				initial="hidden"
				whileInView="show"
				viewport={{ once: true, amount: 0.2 }}
			>
				<Tilt
					tiltMaxAngleX={15}
					tiltMaxAngleY={15}
					transitionSpeed={300}
					scale={1.02}
					gyroscope={true}
					className="bg-primary p-5 rounded-2xl w-full h-full 
						shadow-lg shadow-black/30 
						hover:shadow-2xl hover:shadow-black/50 
						transition-shadow duration-300 border-2 border-tertiary"
				>
					<ProjectContent
						name={name}
						description={description}
						tags={tags}
						image={image}
						source_code_link={source_code_link}
					/>
				</Tilt>
			</motion.div>
		);
	}
);

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
			<p className="mt-2 text-secondary text-[14px] leading-relaxed">
				{description}
			</p>
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

/* ---------- New Component ---------- */
const ExperienceBlock = ({ title, duration, description, projects }) => (
	<div className="mt-4 blue-green-gradient rounded-[20px]">
		<div
			className={`bg-black-100 rounded-2xl sm:px-16 px-6 sm:pt-8 sm:pb-16 py-10 sm:min-h-[42vh] min-h-[50vh]`}
		>
			<motion.div
				variants={textVariant()}
				initial="hidden"
				whileInView="show"
				viewport={{ once: true, amount: 0.2 }}
			>
				<h2 className={styles.porfolioHeadText}>{title}</h2>
				<p className={styles.porfolioExperience}>{duration}</p>
				<p className="text-secondary text-base leading-[30px]">
					{description}
				</p>
			</motion.div>
		</div>

		<div className="-mt-16 pb-14 sm:px-8 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{projects}
		</div>
	</div>
);

const Feedbacks = () => {
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
				viewport={{ once: true, amount: 0.25 }}
			>
				<p className={styles.sectionSubText}>Projects</p>
				<h2 className={styles.sectionHeadText}>
					<span className="text-tertiary">_</span>Professional
				</h2>
			</motion.div>
			<ExperienceBlock
				title="Zeo Technology"
				duration="3 years 8 months"
				description="A pioneering Industry 4.0 company with worldwide reach"
				projects={renderedProjects}
			/>
			<motion.div
				variants={textVariant()}
				initial="hidden"
				whileInView="show"
				viewport={{ once: true, amount: 0.25 }}
				className="mt-16"
			>
				<p className={styles.sectionSubText}>Projects</p>
				<h2 className={styles.sectionHeadText}>
					<span className="text-tertiary">_</span>Personal
				</h2>
			</motion.div>
			<ExperienceBlock
				title="Accomplished"
				duration="7 months"
				description="Includes a few completed projects that are no longer under active development, but are maintained and updated as needed"
				projects={renderedProjects}
			/>
			<ExperienceBlock
				title="Active and planned"
				duration="3 months"
				description="Features projects under active development or planned for near- to mid-term completion. Only completed experience is listed above"
				projects={renderedProjects}
			/>
			<motion.div
				variants={textVariant()}
				initial="hidden"
				whileInView="show"
				viewport={{ once: true, amount: 0.25 }}
				className="w-full my-12 flex justify-center px-2"
			>
				<h2
					className="
					  relative text-white md:text-[35px] sm:text-[30px] xs:text-[25px] text-[20px]
					  font-bold rounded-2xl p-6 border-2 border-tertiary 
					  transform-gpu transition-all duration-500
					  hover:scale-105  text-center
					  w-full max-w-4xl
					"
					style={{
						boxShadow: "inset 0 0 25px 15px rgba(0,0,0,0.8)"
					}}
				>
					Total experience: <br />
					<span className="md:text-[40px] sm:text-[35px] xs:text-[30px] text-[25px] text-tertiary">4 years 6 months</span>
				</h2>
			</motion.div>


		</>
	);
};

export default SectionWrapper(Feedbacks, "");
