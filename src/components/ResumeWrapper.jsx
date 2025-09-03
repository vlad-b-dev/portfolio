import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "react-i18next";
import AutoTrans from "./AutoTrans";
import { ArrowDownTrayIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import resumeEs from "../assets/resume-pdf/Vladyslav_Boychuk_curriculum.pdf";
import resumeEn from "../assets/resume-pdf/Vladyslav_Boychuk_resume.pdf";

const ResumeWrapper = () => {
    const [lang, setLang] = useState("es");
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
    const { t } = useTranslation();
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);

    const handleLangChange = (lng) => {
        setLang(lng);
    };

    useEffect(() => {
        const measure = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.clientWidth);
            }
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    const pdfUrl = lang === "es" ? resumeEs : resumeEn;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: -250 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
                type: "spring",
                stiffness: 60,
                damping: 12,
                mass: 1.2,
            }}
            className="relative text-white sm:text-[30px] text-[18px] font-bold rounded-2xl pb-8 p-4 bg-black-100 mt-8 w-full mx-auto"
            style={{
                boxShadow: "inset 0 0 35px 25px rgba(0,0,0,1)",
            }}
        >
            <div className="flex justify-center items-center gap-8">
                <AutoTrans i18nKey="projects.resume.title"></AutoTrans>
                <div
                    ref={containerRef}
                    className="relative flex items-center bg-secondary/20 backdrop-blur-lg rounded-2xl w-32 h-[3.4vh] overflow-hidden select-none shrink-0"
                >
                    <motion.div
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className="absolute top-0 bottom-0 left-0 w-1/2 rounded-2xl bg-tertiary/90 will-change-transform pointer-events-none transform-gpu"
                        initial={false}
                        animate={{
                            x: lang === "en" ? 0 : containerWidth ? containerWidth / 2 : "100%",
                        }}
                    />
                    {["en", "es"].map((lng) => (
                        <motion.button
                            key={lng}
                            onClick={() => handleLangChange(lng)}
                            className={`relative z-10 flex-1 text-sm font-semibold transition-colors ${lang === lng ? "text-black" : "text-secondary hover:text-tertiary"}`}
                            whileTap={{ scale: 0.9 }}
                        >
                            {lng.toUpperCase()}
                        </motion.button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
                <a
                    href={pdfUrl}
                    download={lang === "es" ? "Vladyslav_Boychuk_curriculum.pdf" : "Vladyslav_Boychuk_resume.pdf"}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold text-base rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    {t("projects.resume.download")}

                </a>
                <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold text-base rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                >
                    <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                    {t("projects.resume.open")}
                </a>

            </div>
        </motion.div>
    );
};

export default ResumeWrapper;
