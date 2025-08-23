import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { styles } from "../styles";
import { navLinks } from "../constants";
import { logo, menu, close } from "../assets";

const menuVariants = {
	hidden: { opacity: 0, x: -60 },
	visible: { opacity: 1, x: 0 },
	exit: { opacity: 0, x: -60 },
};

const mobileLinkVariants = {
	hidden: { opacity: 0, x: -20, rotate: -5, scale: 0.95 },
	visible: { opacity: 1, x: 0, rotate: 0, scale: 1 },
};

const iconVariants = {
	hidden: (direction) => ({
		opacity: 0,
		rotate: direction === "open" ? 90 : -90,
	}),
	visible: { opacity: 1, rotate: 0 },
	exit: (direction) => ({
		opacity: 0,
		rotate: direction === "open" ? -90 : 90,
	}),
};

const Navbar = () => {
	const [active, setActive] = useState("");
	const [toggle, setToggle] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	const toggleMenu = useRef(null);
	const glowRef = useRef(null);
	const navRef = useRef(null);

	const rafRef = useRef(0);
	const posRef = useRef({ x: 0 });
	const targetRef = useRef({ x: 0 });
	const insideRef = useRef(false);

	// Scroll listener
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 5);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	// Click outside mobile menu
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (toggleMenu.current && !toggleMenu.current.contains(e.target)) {
				setToggle(false);
			}
		};
		if (toggle) document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [toggle]);

	// Glow effect
	useEffect(() => {
		if (!glowRef.current || !navRef.current) return;

		const glow = glowRef.current;
		const nav = navRef.current;
		const lerp = (a, b, t) => a + (b - a) * t;
		const SMOOTH = 0.5;

		let fadeTimeout = null;

		const updateGlow = () => {
			posRef.current.x = lerp(posRef.current.x, targetRef.current.x, SMOOTH);

			if (insideRef.current && scrolled) {
				const centerY = nav.offsetHeight / 2;
				glow.style.background = `radial-gradient(
          30vw 30vw at ${posRef.current.x}px ${centerY}px,
          rgba(132,255,233,0.22) 0%,
          rgba(132,255,233,0.14) 40%,
          rgba(132,255,233,0.06) 70%,
          rgba(132,255,233,0) 100%
        )`;
				rafRef.current = requestAnimationFrame(updateGlow);
			} else {
				rafRef.current = 0;
			}
		};

		const handleMouseEnter = (e) => {
			if (!scrolled) return;
			insideRef.current = true;

			const x = e.clientX - nav.getBoundingClientRect().left;
			posRef.current.x = x;
			targetRef.current.x = x;

			glow.style.transition = "opacity 2s ease-out";
			glow.style.opacity = 0.6;

			if (!rafRef.current) rafRef.current = requestAnimationFrame(updateGlow);
		};

		const handleMouseMove = (e) => {
			if (!insideRef.current || !scrolled) return;
			targetRef.current.x = e.clientX - nav.getBoundingClientRect().left;
			if (!rafRef.current) rafRef.current = requestAnimationFrame(updateGlow);
		};

		const handleMouseLeave = () => {
			insideRef.current = false;
			glow.style.transition = "opacity 1s ease-out";
			glow.style.opacity = 0;
		};

		nav.addEventListener("mouseenter", handleMouseEnter);
		nav.addEventListener("mousemove", handleMouseMove);
		nav.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			nav.removeEventListener("mouseenter", handleMouseEnter);
			nav.removeEventListener("mousemove", handleMouseMove);
			nav.removeEventListener("mouseleave", handleMouseLeave);
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
			clearTimeout(fadeTimeout);
		};
	}, [scrolled]);

	return (
		<>
			<nav
				ref={navRef}
				className={`${styles.paddingX} w-full flex items-center py-4 fixed top-0 z-20
          transition-colors duration-300
          ${scrolled ? "bg-primary/60 backdrop-blur-md" : "bg-transparent"}`}
			>
				{/* Glow layer */}
				<div
					ref={glowRef}
					className="absolute inset-0 pointer-events-none rounded-md opacity-0"
					style={{ willChange: "background, opacity" }}
				/>

				<div className="w-full max-w-7xl mx-auto flex items-center justify-between relative">
					<div className="sm:hidden flex w-full items-center relative">
						<AnimatePresence mode="wait" initial={false}>
							{toggle ? (
								<motion.img
									key="close"
									src={close}
									alt="close"
									className="w-7 h-7 mb-1 object-contain cursor-pointer"
									custom="close"
									variants={iconVariants}
									initial="hidden"
									animate="visible"
									exit="exit"
									transition={{ duration: 0.15 }}
									onClick={() => setToggle(false)}
								/>
							) : (
								<motion.img
									key="menu"
									src={menu}
									alt="menu"
									className="w-7 h-7 mb-1 object-contain cursor-pointer"
									custom="open"
									variants={iconVariants}
									initial="hidden"
									animate="visible"
									exit="exit"
									transition={{ duration: 0.15 }}
									onClick={() => setToggle(true)}
								/>
							)}
						</AnimatePresence>

						<Link
							to="/"
							onClick={() => window.scrollTo(0, 0)}
							className="absolute left-1/2 transform -translate-x-1/2"
						>
							<img
								src={logo}
								alt="logo"
								className="w-36 max-w-full h-auto object-contain"
							/>
						</Link>

						<p className="ml-auto text-white text-[3.25vw] font-bold cursor-pointer whitespace-nowrap mb-1 -mr-1">
							Full Stack <br /> Developer
						</p>
					</div>

					<Link
						to="/"
						className="hidden sm:flex items-center gap-2"
						onClick={() => {
							setActive("");
							window.scrollTo(0, 0);
						}}
					>
						<img src={logo} alt="logo" className="sm:w-1/4 w-2/5 object-contain" />
						<p className="text-white text-sm md:text-2xl font-bold cursor-pointer flex">
							Full Stack Developer
						</p>
					</Link>

					<ul className="list-none hidden sm:flex flex-row gap-10">
						{navLinks.map((nav) => (
							<li
								key={nav.id}
								className={`${active === nav.title ? "text-white" : "text-secondary"} hover:text-white text-[14px] font-medium cursor-pointer`}
								onClick={() => setActive(nav.title)}
							>
								<a href={`#${nav.id}`}>{nav.title}</a>
							</li>
						))}
					</ul>
				</div>
			</nav>

			<AnimatePresence>
				{toggle && (
					<motion.div
						ref={toggleMenu}
						variants={menuVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						transition={{ type: "spring", stiffness: 300, damping: 25 }}
						className="p-6 bg-primary/60 backdrop-blur-md fixed top-20 left-0 min-w-10 z-30 rounded-xl flex-col flex"
					>
						<motion.ul
							className="list-none flex flex-col gap-4"
							initial="hidden"
							animate="visible"
							exit="hidden"
							variants={{
								visible: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
							}}
						>
							{navLinks.map((nav) => (
								<motion.li
									key={nav.id}
									className={`font-medium cursor-pointer text-xl ${active === nav.title ? "text-white" : "text-secondary"
										}`}
									onClick={() => {
										setToggle(false);
										setActive(nav.title);
									}}
									variants={mobileLinkVariants}
									transition={{ type: "spring", stiffness: 400, damping: 25 }}
								>
									<a href={`#${nav.id}`}>{nav.title}</a>
								</motion.li>
							))}
						</motion.ul>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default Navbar;
