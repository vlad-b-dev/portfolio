import { CityCanvas } from "./canvas";
import { DynamicText } from ".";
import { styles } from "../styles";
import { motion } from "framer-motion";

const WelcomeSection = () => {
	return (
		<section className="relative w-full h-screen mx-auto mb-12">
			{/* Header Section */}
			<div
				className={`absolute inset-0 top-[100px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
			>
				{/* Vertical Accent Line */}
				<div className="flex flex-col justify-center items-center mt-5">
					<div className="w-5 h-5 rounded-full bg-[#84ffe9]" />
					<div className="w-1 sm:h-80 h-40 blue-gradient" />
				</div>

				{/* Text Content */}
				<div>
					<h1 className={`${styles.heroHeadText} text-white`}>
						Hi, I'm <span className="text-[#84ffe9]">Vlad</span>
					</h1>
					<p className={`${styles.heroSubText} mt-2 text-white-100`}>
						Software engineer,
						<br className="sm:block hidden" />
						passionate about design and development
					</p>
					<DynamicText />
				</div>
			</div>

			{/* City Canvas */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					width: "100%",
					height: "100%",
					opacity: 0,
					pointerEvents: "none",
				}}
			/>
			<CityCanvas />

			{/* Scroll Indicator */}
			<div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center sm:mb-0">
				<a href="#about">
					<div className="sm:w-8 sm:h-16 w-10 h-20 rounded-3xl border-4 border-white flex justify-center items-start p-2">
						<motion.div
							animate={{ y: [0, 24, 0] }}
							transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
							className="w-3 h-3 rounded-full bg-tertiary mb-1"
						/>
					</div>
				</a>
			</div>
		</section>
	);
};

export default WelcomeSection;
