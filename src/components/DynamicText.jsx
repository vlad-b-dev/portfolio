import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const skills = [
  "Angular",
  "React",
  "Spring",
  "Three.js",
  "UX-UI",
  "Microservices",
  "Node.js",
  "Databases",
  "Javascript",
  "TypeScript",
  "Java",
  "Testing",
  "QA",
  "APIs",
  "Python",
];

const letterContainer = {
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

const letterVariant = {
  hidden: { opacity: 0, y: -20, rotateX: 90 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: "spring", stiffness: 200, damping: 15 },
  },
  exit: { opacity: 0, y: 20, rotateX: -90 },
};

const DynamicText = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % skills.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-2 h-12 flex items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={skills[index]}
          variants={letterContainer}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex space-x-1 text-[#84ffe9] font-bold text-xl sm:text-2xl"
        >
          {skills[index].split("").map((char, i) => (
            <motion.span key={i} variants={letterVariant}>
              {char}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DynamicText;
