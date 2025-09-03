import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion"
import { SectionHeader } from "../components";
import AutoTrans from "../components/AutoTrans";

const Contact = () => {
	const { t } = useTranslation();
	const formRef = useRef();
	const [form, setForm] = useState({
		name: "",
		email: "",
		message: "",
	});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setLoading(true);

		emailjs
			.send(
				import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
				import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
				{
					from_name: form.name,
					from_email: form.email,
					reply_to: form.email,
					message: form.message,
				},
				import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
			)
			.then(
				() => {
					setLoading(false);
					setSuccess(true);
					setForm({ name: "", email: "", message: "" });
					setTimeout(() => setSuccess(false), 3000);
				},
				(error) => {
					setLoading(false);
					console.error(error);
					alert(t(`contact.error`));
				}
			);
	};

	return (
		<div className={`flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}>
			<motion.div
				variants={slideIn("left", "tween", 0.2, 1)}
				className="flex-[0.75] bg-black-100 p-6 rounded-2xl z-10 relative"
			>
				<SectionHeader subText={t(`contact.title`)} headText={t(`contact.email`)} />

				<form ref={formRef} onSubmit={handleSubmit} className="mt-2 flex flex-col gap-4 z-20" >
					<label className="flex flex-col">
						<span className="text-white font-medium mb-2"><AutoTrans i18nKey="contact.name"></AutoTrans></span>
						<input
							type="text"
							name="name"
							value={form.name}
							onChange={handleChange}
							placeholder={t(`contact.namePlaceholder`)}
							className="bg-primary py-2 px-4 placeholder:text-secondary text-white rounded-lg outline-none border border-tertiary font-medium"
						/>
					</label>

					<label className="flex flex-col">
						<span className="text-white font-medium mb-2"><AutoTrans i18nKey="contact.email"></AutoTrans></span>
						<input
							type="email"
							name="email"
							value={form.email}
							onChange={handleChange}
							placeholder={t(`contact.emailPlaceholder`)}
							className="bg-primary py-2 px-4 placeholder:text-secondary text-white rounded-lg outline-none border border-tertiary font-medium"
						/>
					</label>

					<label className="flex flex-col">
						<span className="text-white font-medium mb-2"><AutoTrans i18nKey="contact.message"></AutoTrans></span>
						<textarea
							rows={4}
							name="message"
							value={form.message}
							onChange={handleChange}
							placeholder={t(`contact.messagePlaceholder`)}
							className="bg-primary py-2 px-4 placeholder:text-secondary text-white rounded-lg outline-none border border-tertiary font-medium resize-none overflow-y-auto"
						/>
					</label>

					<button
						type="submit"
						className="
            			  bg-tertiary 
            			  py-2 px-6 
            			  rounded-xl 
            			  outline-none 
            			  w-fit 
            			  text-black-100 
            			  font-bold 
            			  shadow-md shadow-primary 
            			  transform 
            			  transition-transform 
            			  duration-150 
            			  ease-in-out
            			  hover:scale-95 
            			  hover:translate-y-0.5
            			"
					>
						{loading ? t(`contact.sending`) : t(`contact.send`)}
					</button>
				</form>

				<AnimatePresence>
					{success && isMobile && (
						<motion.div
							key="success-mobile"
							initial={{ x: 0, y: -50, opacity: 0 }}
							animate={{ x: 0, y: 0, opacity: 1 }}
							exit={{ x: 0, y: -50, opacity: 0 }}
							transition={{ type: "spring", stiffness: 120, damping: 20 }}
							className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center bg-black/80 rounded-2xl"
						>
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								exit={{ scale: 0 }}
								transition={{ duration: 0.5 }}
								className="text-tertiary text-[6rem] mb-4"
							>
								✓
							</motion.div>
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ delay: 0.3 }}
								className="text-white text-2xl"
							>
								<AutoTrans i18nKey="contact.success"></AutoTrans>
							</motion.p>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>

			<div className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px] relative">
				<AnimatePresence>
					{(!success || isMobile) && (
						<motion.div
							key="earth"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={!isMobile ? { x: -2000, opacity: 0 } : {}}
							transition={{ duration: 4, type: "tween" }}
							className="absolute w-full h-full"
						>
							<EarthCanvas />
						</motion.div>
					)}

					{success && !isMobile && (
						<motion.div
							key="success"
							initial={{ x: 300, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: -300, opacity: 0 }}
							transition={{ type: "spring", stiffness: 120, damping: 20 }}
							className="absolute w-full h-full flex flex-col items-center justify-center text-center"
						>
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								exit={{ scale: 0 }}
								transition={{ duration: 0.5 }}
								className="text-tertiary text-[6rem] mb-4"
							>
								✓
							</motion.div>
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ delay: 0.3 }}
								className="text-white text-2xl"
							>
								<AutoTrans i18nKey="contact.success"></AutoTrans>
							</motion.p>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};


export default SectionWrapper(Contact, "contact");
