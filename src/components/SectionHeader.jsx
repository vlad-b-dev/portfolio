import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";

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

const SectionHeader = ({ subText, headText, className = "" }) => (
	<motion.div variants={textVariant()} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className={className}>
		<p className={styles.sectionSubText}>{subText}</p>
		<h2 className={styles.sectionHeadText}>
			<span className="text-tertiary">_</span>
			{headText}
		</h2>
	</motion.div>
);

export default SectionHeader;