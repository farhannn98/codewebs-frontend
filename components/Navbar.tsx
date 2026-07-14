"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Portfolios", href: "#portfolio" },
  { name: "Order", href: "#order" },
  { name: "Workflow", href: "#workflow" },
  { name: "FAQ", href: "#faq" },
];

const burgerTopVariants: Variants = {
  closed: { rotate: 0, y: 0 },
  open: { rotate: 45, y: 6 },
};

const burgerMiddleVariants: Variants = {
  closed: { opacity: 1 },
  open: { opacity: 0 },
};

const burgerBottomVariants: Variants = {
  closed: { rotate: 0, y: 0 },
  open: { rotate: -45, y: -6 },
};

const menuVariants: Variants = {
  closed: {
    opacity: 0,
    y: -15,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
};

export default function Navbar() {
  const [hoveredPath, setHoveredPath] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  return (
    // MEMASTIKAN LAYER HEADER SELALU BERADA DI KASTA TERTINGGI (Z-50)
    <header className="fixed top-0 z-50 w-full flex flex-col items-center pt-6 px-6 pointer-events-none">
      {/* MAIN FLOATING NAVBAR PILL */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "circOut" }}
        className="pointer-events-auto relative w-full max-w-6xl flex items-center justify-between gap-4 px-6 py-3 rounded-full border border-white/40 bg-white/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] ring-1 ring-slate-900/5"
      >
        {/* LOGO */}
        <div className="flex items-center">
          <a href="/" className="group flex items-center gap-1.5">
            <div className="h-6 w-6 relative group-hover:rotate-12 transition-transform duration-300">
              <Image
                src="/assets/logoCD.png" // Path gambar di folder public
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-sm font-black tracking-tighter text-slate-900 uppercase">
              CODE<span className="text-blue-600">WEBS.</span>
            </span>
          </a>
        </div>

        {/* MENU DESKTOP */}
        <div className="hidden md:flex items-center">
          <ul className="flex gap-1 relative">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onMouseEnter={() => setHoveredPath(link.name)}
                  onMouseLeave={() => setHoveredPath("")}
                  className="relative px-4 py-2 text-xs font-bold tracking-wide text-slate-600 hover:text-slate-900 transition-colors z-10 block"
                >
                  {link.name}
                  {hoveredPath === link.name && (
                    <motion.div
                      layoutId="nav-hover"
                      className="absolute inset-0 bg-slate-200/50 rounded-full -z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT SIDE ACTIONS (User Icon, CTA, Burger) */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* USER LOGIN ICON (Tampil di Mobile & Desktop) */}
          <a
            href="/login" // Ganti dengan link login Anda
            className="flex items-center justify-center p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100/80 rounded-full transition-all duration-200"
            aria-label="Login"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </a>

          {/* CTA BUTTON DESKTOP */}
          <div className="hidden md:flex items-center">
            <a
              href="#order"
              className="group relative inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold text-white transition-all duration-200 bg-slate-900 rounded-full hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 active:scale-95"
            >
              Start Project
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
                className="ml-1.5 inline-block"
              >
                →
              </motion.span>
            </a>
          </div>

          {/* INTERACTIVE BURGER BUTTON FOR MOBILE */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-900 focus:outline-none cursor-pointer flex flex-col justify-center items-center gap-[4px] h-8 w-8 relative hover:bg-slate-100/80 rounded-full transition-colors"
              aria-label="Toggle Menu"
            >
              <motion.span
                variants={burgerTopVariants}
                animate={isOpen ? "open" : "closed"}
                transition={{ duration: 0.2 }}
                className="w-5 h-[2px] bg-slate-900 rounded-full origin-center"
              />
              <motion.span
                variants={burgerMiddleVariants}
                animate={isOpen ? "open" : "closed"}
                transition={{ duration: 0.2 }}
                className="w-5 h-[2px] bg-slate-900 rounded-full"
              />
              <motion.span
                variants={burgerBottomVariants}
                animate={isOpen ? "open" : "closed"}
                transition={{ duration: 0.2 }}
                className="w-5 h-[2px] bg-slate-900 rounded-full origin-center"
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* DROPDOWN MENU MOBILE OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="pointer-events-auto w-full max-w-6xl mt-3 p-6 bg-white/80 backdrop-blur-xl border border-white/40 rounded-[2rem] shadow-[0_16px_32px_rgba(0,0,0,0.08)] ring-1 ring-slate-900/5 md:hidden flex flex-col gap-4 overflow-hidden"
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-4 py-3 text-sm font-black text-slate-700 hover:text-blue-600 rounded-xl hover:bg-slate-100/50 transition-all"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            <hr className="border-slate-200/60 my-1" />

            <a
              href="#order"
              onClick={() => setIsOpen(false)}
              className="w-full inline-flex items-center justify-center px-5 py-4 text-xs font-black tracking-widest uppercase text-white bg-slate-900 rounded-2xl hover:bg-blue-600 active:scale-98 transition-all"
            >
              Start Project — Let's Build
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
