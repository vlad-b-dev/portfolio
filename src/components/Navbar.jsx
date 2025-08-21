import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { styles } from "../styles";
import { navLinks } from "../constants";
import { logo, menu, close } from "../assets";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 5);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`${styles.paddingX} w-full flex items-center py-4 fixed top-0 z-20 transition-colors duration-300 ${scrolled
        ? "bg-primary/60 backdrop-blur-md"
        : "bg-transparent"
        }`}
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between relative">
        <div className="sm:hidden flex w-full items-center relative">
          <img
            src={toggle ? close : menu}
            alt="menu"
            className="w-7 h-7 mb-1 object-contain"
            onClick={() => setToggle(!toggle)}
          />
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
              <span className="text-secondary"> &nbsp; | </span>UX-UI Expert
              <span className="text-secondary"> | </span>Graphic Designer
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
          <div
            className={`${
              !toggle ? "hidden" : "flex"
              } p-6 black-gradient absolute top-20 left-0 mx-0 -my-5 min-w-[140px] z-10 rounded-xl flex-col`}
          >
            <ul className="list-none flex flex-col gap-4">
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`font-poppins font-medium cursor-pointer text-[16px] ${
                    active === nav.title ? "text-white" : "text-secondary"
                  }`}
                  onClick={() => {
                    setToggle(false);
                    setActive(nav.title);
                  }}
                >
                  <a href={`#${nav.id}`}>{nav.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
