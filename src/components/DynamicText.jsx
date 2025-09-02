import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// === Config ===
const SKILLS = [
	"Agile",
	"Angular",
	"React",
	"Spring",
	"Three.js",
	"UX/UI",
	"Microservices",
	"Scrum",
	"Node.js",
	"3D Web",
	"Databases",
	"JavaScript",
	"TypeScript",
	"Java",
	"Testing",
	"APIs",
	"Python",
];

const INTERVAL_MS = 4700;

// === Animation Variants ===
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.2 },
	},
	exit: {
		opacity: 0,
		transition: { staggerChildren: 0.2, staggerDirection: 1 },
	},
};

const letterVariants = {
	hidden: { opacity: 0, y: -20, rotateX: 90 },
	visible: {
		opacity: 1,
		y: 0,
		rotateX: 0,
		transition: { type: "spring", stiffness: 200, damping: 15 },
	},
	exit: { opacity: 0, y: 20, rotateX: -90 },
};

// === Component ===
const DynamicText = () => {
	const [index, setIndex] = useState(0);

	// Cycle through skills on interval
	useEffect(() => {
		const interval = setInterval(() => {
			setIndex((prev) => (prev + 1) % SKILLS.length);
		}, INTERVAL_MS);
		return () => clearInterval(interval);
	}, []);

	const currentSkill = SKILLS[index];

	return (
		<div className="sm:mt-2 h-12 flex items-center">
			<AnimatePresence mode="wait">
				<motion.div
					key={currentSkill}
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					exit="exit"
					className="flex space-x-1 text-[#84ffe9] font-bold text-xl sm:text-2xl"
				>
					{currentSkill.split("").map((char, i) => (
						<motion.span key={i} variants={letterVariants}>
							{char}
						</motion.span>
					))}
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default DynamicText;
