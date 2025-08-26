import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const ExperienceDisplay = ({ years, months, duration = 2000 }) => {
    const [displayYears, setDisplayYears] = useState(0);
    const [displayMonths, setDisplayMonths] = useState(0);
    const [readyToCount, setReadyToCount] = useState(false);
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 1 });
    const startedRef = useRef(false);

    useEffect(() => {
        if (!inView || startedRef.current) return;
        startedRef.current = true;

        const slideDuration = 700;
        const timer = setTimeout(() => setReadyToCount(true), slideDuration);

        return () => clearTimeout(timer);
    }, [inView]);

    useEffect(() => {
        if (!readyToCount) return;

        let startTime = null;
        const totalTargetMonths = years * 12 + months;

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const currentMonths = Math.floor(progress * totalTargetMonths);

            const y = Math.floor(currentMonths / 12);
            const m = currentMonths % 12;

            setDisplayYears(y);
            setDisplayMonths(m);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    }, [readyToCount, years, months, duration]);

    return (
        <motion.h2
            ref={ref}
            initial={{ opacity: 0, y: -250 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
                type: "spring",
                stiffness: 60,
                damping: 12,
                mass: 1.2,
            }}
            className="
        relative text-white sm:text-[30px] text-[18px]
        font-bold rounded-2xl pb-8 p-4  bg-black-100 
        mt-8 text-center text-white
        w-full mx-auto
      "
            style={{
                boxShadow: "inset 0 0 35px 25px rgba(0,0,0,1)",
            }}
        >
            Total experience: <br />
            <span className="sm:text-[40px] text-[22px] text-tertiary">
                +
                <span className="inline-block min-w-[2ch] text-right">
                    {displayYears}
                </span>{" "}
                {displayYears === 1 ? "year" : "years"}{" "}
                <span className="inline-block min-w-[2ch] text-right">
                    {displayMonths}
                </span>{" "}
                {displayMonths === 1 ? "month" : "months"}
            </span>
        </motion.h2>
    );
};

export default ExperienceDisplay;
