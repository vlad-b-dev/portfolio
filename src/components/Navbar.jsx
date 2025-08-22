import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import { styles } from "../styles";
import { navLinks } from "../constants";
import { logo, menu, close } from "../assets";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleMenu = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 5);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toggleMenu.current && !toggleMenu.current.contains(event.target)) {
        setToggle(false);
      }
    };

    if (toggle) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggle, setToggle]);
  return (
    <nav
      className={`${styles.paddingX} w-full flex items-center py-4 fixed top-0 z-20 transition-colors duration-300 ${scrolled
        ? "bg-primary/60 backdrop-blur-md"
        : "bg-transparent"
        }`}
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between relative">
        <div className="sm:hidden flex w-full items-center relative">
          <AnimatePresence mode="wait" initial={false}>
            {toggle ? (
              <motion.img
                key="close"
                src={close}
                alt="close"
                className="w-7 h-7 mb-1 object-contain"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.15 }}
                onClick={() => setToggle(!toggle)}
              />
            ) : (
              <motion.img
                key="menu"
                src={menu}
                alt="menu"
                className="w-7 h-7 mb-1 object-contain"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => setToggle(!toggle)}
                />
            )}
          </AnimatePresence>
          <Link
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            className="absolute left-1/2 transform -translate-x-1/2"
          >
            <img src={logo} alt="logo" className="w-38 max-w-full h-auto object-contain" />
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
          <img
            src={logo}
            alt="logo"
            className="sm:w-1/4 w-2/5 object-contain"
          />
          <p className="text-white text-sm md:text-lg font-bold cursor-pointer flex">
            Full Stack Developer
            <span className="sm:block hidden">
              <span className="text-secondary"> &nbsp; | </span>UX-UI
              <span className="text-secondary"> | </span>Graphic Design
            </span>
          </p>
        </Link>

        <ul className="list-none hidden sm:flex flex-row gap-10">
          {navLinks.map((nav) => (
            <li
              key={nav.id}
              className={`${
                active === nav.title ? "text-white" : "text-secondary"
              } hover:text-white text-[14px] font-medium cursor-pointer`}
              onClick={() => setActive(nav.title)}
            >
              <a href={`#${nav.id}`}>{nav.title}</a>
            </li>
          ))}
        </ul>

        <div className="sm:hidden flex flex-shrink-0">
          <AnimatePresence>
            {toggle && (
              <motion.div
                ref={toggleMenu}
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="p-6 bg-primary/60 backdrop-blur-md absolute top-20 left-0 mx-0 -my-5 min-w-[140px] z-10 rounded-xl flex-col flex"
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
                      className={`font-poppins font-medium cursor-pointer text-[16px] ${active === nav.title ? "text-white" : "text-secondary"
                        }`}
                      onClick={() => {
                        setToggle(false);
                        setActive(nav.title);
                      }}
                      variants={{
                        hidden: { opacity: 0, x: -20, rotate: -5, scale: 0.95 },
                        visible: { opacity: 1, x: 0, rotate: 0, scale: 1 },
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <a href={`#${nav.id}`}>{nav.title}</a>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
