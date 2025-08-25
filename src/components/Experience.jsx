import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { professionalProjects, acomplishedProjects, activeProjects } from "../constants";
import ExperienceDisplay from "./ExperienceDisplay";
import { github } from "../assets";

const ProjectCard = memo(
	({ index, name, description, tags, image, source_code_link, link }) => {
		return (
			<motion.div
				variants={fadeIn("up", "spring", index * 0.5, 0.75)}
				initial="hidden"
				whileInView="show"
				viewport={{ once: true, amount: 0.2 }}
			>
				<Tilt
					tiltMaxAngleX={17}
					tiltMaxAngleY={15}
					transitionSpeed={300}
					scale={1.04}
					gyroscope={false}
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
						link={link}
					/>
				</Tilt>
			</motion.div>
		);
	}
);

const ProjectContent = ({ name, description, tags, image, source_code_link, link }) => (
	<>
		<div className="relative w-full h-[230px]">
			<img
				src={image}
				alt={name}
				className="w-full h-full object-cover rounded-2xl"
				loading="lazy"
			/>

			{(source_code_link || link) && (
				<div className="absolute inset-0 flex justify-end m-3 card-img_hover gap-2">
					{source_code_link && (
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
			className={`bg-black-100 rounded-2xl sm:px-16 px-6 sm:pt-8 sm:pb-16 py-10 sm:min-h-[45vh] min-h-[57vh]`}
		>
			<motion.div
				variants={textVariant()}
				initial="hidden"
				whileInView="show"
				viewport={{ once: true, amount: 0.2 }}
			>
				<h2 className={styles.porfolioHeadText}>{title}</h2>
				<p className={styles.porfolioExperience}>{duration}</p>
				<p className="text-secondary text-[14px] leading-[30px]">
					{description}
				</p>
			</motion.div>
		</div>

		<div className="-mt-16 pb-14 sm:px-8 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{projects}
		</div>
	</div>
);

const Experience = () => {
	const renderedProfessionalProjects = useMemo(
		() =>
			professionalProjects.map((project, index) => (
				<ProjectCard key={`project-${index}`} index={index} {...project} />
			)),
		[]
	);
	const renderedAcomplishedProjects = useMemo(
		() =>
			acomplishedProjects.map((project, index) => (
				<ProjectCard key={`project-${index}`} index={index} {...project} />
			)),
		[]
	);
	const renderedActiveProjects = useMemo(
		() =>
			activeProjects.map((project, index) => (
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
				description="A global Industry 4.0 pioneer, blending agility and innovation to transform manufacturing. Recognized worldwide as a leader in MES systems, and trusted by industry leaders including Cinfa, Florette, and Onnera"
				projects={renderedProfessionalProjects}
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
				projects={renderedAcomplishedProjects}
			/>
			<ExperienceBlock
				title="Active and planned"
				duration="3 months"
				description="Features projects under active development or planned for near- to mid-term completion. Only completed experience is listed above"
				projects={renderedActiveProjects}
			/>
			<ExperienceDisplay years={4} months={6} duration={3000} />
		</>
	);
};

export default SectionWrapper(Experience, "");
