import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import i18n from "../i18n";

export default function LanguageSwitch() {
    const [lang, setLang] = useState(i18n.language || "en");
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);

    const changeLang = (lng) => {
        i18n.changeLanguage(lng);
        setLang(lng);
    };

    useEffect(() => {
        const onLangChanged = (lng) => setLang(lng);
        i18n.on("languageChanged", onLangChanged);
        return () => i18n.off("languageChanged", onLangChanged);
    }, []);

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

    return (
        <div ref={containerRef} className="relative flex items-center bg-secondary/30 backdrop-blur-lg rounded-2xl w-32 h-[3vh] overflow-hidden select-none shrink-0">
            <motion.div
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="absolute top-0 bottom-0 left-0 w-1/2 rounded-2xl bg-secondary/70  will-change-transform pointer-events-none transform-gpu"
                initial={false}
                animate={{ x: lang === "en" ? 0 : (containerWidth ? containerWidth / 2 : "100%") }}
            />

            {["en", "es"].map((lng) => (
                <motion.button
                    key={lng}
                    onClick={() => changeLang(lng)}
                    className={`relative z-10 flex-1 text-sm font-semibold transition-colors
            ${lang === lng ? "text-white" : "text-secondary hover:text-white"}`}
                    whileTap={{ scale: 0.9 }}
                >
                    {lng.toUpperCase()}
                </motion.button>
            ))}
        </div>
    );
}
