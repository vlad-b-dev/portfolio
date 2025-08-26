import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";

import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";

const Contact = () => {
	const formRef = useRef();
	const [form, setForm] = useState({
		name: "",
		email: "",
		message: "",
	});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false); // Controla animación de éxito
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
					to_name: "Mi Nombre",
					from_email: form.email,
					to_email: "miemail@gmail.com",
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
					alert("Ahh, algo salió mal. Intenta nuevamente.");
				}
			);
	};

	return (
		<div className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}>
			{/* Formulario */}
			<motion.div
				variants={slideIn("left", "tween", 0.2, 1)}
				className="flex-[0.75] bg-black-100 p-6 rounded-2xl z-10 relative"
			>
				<p className={styles.sectionSubText}>Send a message</p>
				<h2 className={styles.sectionHeadText}>
					<span className="text-tertiary">_</span>Contact
				</h2>

				<form ref={formRef} onSubmit={handleSubmit} className="mt-3 flex flex-col gap-4">
					<label className="flex flex-col">
						<span className="text-white font-medium mb-2">Name</span>
						<input
							type="text"
							name="name"
							value={form.name}
							onChange={handleChange}
							placeholder="Who are you?"
							className="bg-primary py-2 px-4 placeholder:text-secondary text-white rounded-lg outline-none border border-tertiary font-medium"
						/>
					</label>

					<label className="flex flex-col">
						<span className="text-white font-medium mb-2">Email</span>
						<input
							type="email"
							name="email"
							value={form.email}
							onChange={handleChange}
							placeholder="I will get back to you there"
							className="bg-primary py-2 px-4 placeholder:text-secondary text-white rounded-lg outline-none border border-tertiary font-medium"
						/>
					</label>

					<label className="flex flex-col">
						<span className="text-white font-medium mb-2">Message</span>
						<textarea
							rows={4}
							name="message"
							value={form.message}
							onChange={handleChange}
							placeholder="Share whatever you’d like me to know"
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
						{loading ? "Sending..." : "Send"}
					</button>
				</form>

				{/* Animación de éxito en móvil sobre el formulario */}
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
								Message sent, I will get back to you soon!
							</motion.p>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>

			{/* EarthCanvas y animación de éxito para desktop */}
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
								Thanks! Your message was sent successfully. We’ll get back to you soon
							</motion.p>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};


export default SectionWrapper(Contact, "contact");
