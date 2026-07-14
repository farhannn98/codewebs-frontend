"use client";

import {
  motion,
  Variants,
  useSpring,
  useMotionValue,
  useTransform,
  useScroll,
  useTime,
} from "framer-motion";
import { useEffect, useState, useRef } from "react";

// --- KONFIGURASI SIMULASI FISIKA GRID ---
const GRID_SIZE = 16;
const MOUSE_RADIUS = 130;
const SPRING_CONFIG = { stiffness: 180, damping: 12 };

// Browser Mockup SVG illustration
function BrowserMockup() {
  return (
    <div className="relative w-full h-full">
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-blue-600/20 blur-2xl scale-110 pointer-events-none" />

      {/* Main browser window */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative rounded-2xl overflow-hidden shadow-[0_40px_100px_-20px_rgba(37,99,235,0.35)] border border-white/60 bg-white"
      >
        {/* Browser chrome / top bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-100/80 border-b border-slate-200/80">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>
          {/* URL bar */}
          <div className="flex-1 mx-3 bg-white rounded-md px-3 py-1 text-[10px] text-slate-400 border border-slate-200/80 flex items-center gap-2">
            <svg
              className="w-2.5 h-2.5 text-emerald-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            CodeWebs.id
          </div>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-4 h-4 rounded bg-slate-200/80" />
            ))}
          </div>
        </div>

        {/* Website content preview */}
        <div className="bg-slate-50 overflow-hidden">
          {/* Mock hero section */}
          <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-6 py-8">
            {/* Animated noise/grain overlay */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />
            <div className="relative z-10">
              {/* Mock nav */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-blue-500" />
                  <div className="w-16 h-2 bg-white/20 rounded" />
                </div>
                <div className="hidden sm:flex gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-1.5 bg-white/20 rounded" />
                  ))}
                </div>
                <div className="w-14 h-5 bg-blue-500 rounded-full" />
              </div>

              {/* Mock headline */}
              <div className="mb-4 space-y-2">
                <div className="w-3/4 h-4 bg-white/20 rounded" />
                <div className="w-1/2 h-4 bg-blue-400/40 rounded" />
              </div>
              <div className="space-y-1.5 mb-5">
                <div className="w-full h-2 bg-white/10 rounded" />
                <div className="w-4/5 h-2 bg-white/10 rounded" />
              </div>
              <div className="flex gap-2">
                <div className="w-20 h-6 bg-blue-500 rounded-full" />
                <div className="w-20 h-6 bg-white/10 border border-white/20 rounded-full" />
              </div>
            </div>
          </div>

          {/* Mock content section */}
          <div className="px-6 py-5 bg-white">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { color: "bg-blue-100", accent: "bg-blue-500" },
                { color: "bg-indigo-100", accent: "bg-indigo-500" },
                { color: "bg-violet-100", accent: "bg-violet-500" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 + i * 0.15, duration: 0.5 }}
                  className={`${item.color} rounded-xl p-3`}
                >
                  <div className={`w-5 h-5 ${item.accent} rounded-lg mb-2`} />
                  <div className="space-y-1">
                    <div className="w-3/4 h-2 bg-slate-300/80 rounded" />
                    <div className="w-full h-1.5 bg-slate-200/80 rounded" />
                    <div className="w-2/3 h-1.5 bg-slate-200/80 rounded" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mock portfolio grid */}
            <div className="grid grid-cols-2 gap-2">
              {[
                "from-blue-400 to-indigo-500",
                "from-slate-700 to-slate-900",
                "from-emerald-400 to-teal-500",
                "from-amber-400 to-orange-500",
              ].map((gradient, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 + i * 0.1, duration: 0.4 }}
                  className={`bg-gradient-to-br ${gradient} rounded-lg h-12 flex items-end p-2`}
                >
                  <div className="w-1/2 h-1.5 bg-white/40 rounded" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating accent card – metrics */}
      <motion.div
        initial={{ opacity: 0, x: 30, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -right-8 top-12 bg-white rounded-2xl shadow-2xl border border-slate-100 px-4 py-3 min-w-[130px]"
      >
        <p className="text-[9px] text-slate-400 font-semibold tracking-widest uppercase mb-1">
          PageSpeed
        </p>
        <div className="flex items-end gap-1">
          <span className="text-2xl font-black text-slate-900">99</span>
          <span className="text-xs text-emerald-500 font-bold mb-0.5">
            /100
          </span>
        </div>
        <div className="mt-2 flex gap-1">
          {[90, 100, 85, 95, 99].map((v, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                delay: 1.6 + i * 0.08,
                duration: 0.4,
                ease: "easeOut",
              }}
              style={{ transformOrigin: "bottom", height: `${v * 0.24}px` }}
              className="w-3 bg-gradient-to-t from-blue-500 to-indigo-400 rounded-sm"
            />
          ))}
        </div>
      </motion.div>

      {/* Floating accent card – tech stack */}
      <motion.div
        initial={{ opacity: 0, x: -30, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -left-8 bottom-16 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700/60 px-4 py-3"
      >
        <p className="text-[9px] text-slate-400 font-semibold tracking-widest uppercase mb-2">
          Tech Stack
        </p>
        <div className="flex flex-col gap-1.5">
          {[
            {
              label: "Next.js",
              color: "bg-white",
              textColor: "text-slate-900",
            },
            { label: "Laravel", color: "bg-red-500", textColor: "text-white" },
            { label: "Tailwind", color: "bg-sky-500", textColor: "text-white" },
          ].map((tech, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.7 + i * 0.1 }}
              className="flex items-center gap-2"
            >
              <span className={`w-2 h-2 rounded-sm ${tech.color}`} />
              <span className="text-[10px] text-slate-300 font-medium">
                {tech.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Floating accent card – live build indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8, duration: 0.5 }}
        className="absolute -right-4 bottom-24 bg-emerald-500 text-white rounded-xl px-3 py-2 shadow-lg shadow-emerald-500/30"
      >
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          <span className="text-[10px] font-bold tracking-wide">
            Live Build
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dots, setDots] = useState<any[]>([]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const newDots = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        newDots.push({
          id: `${x}-${y}`,
          baseX: (x / (GRID_SIZE - 1)) * 100,
          baseY: (y / (GRID_SIZE - 1)) * 100,
        });
      }
    }
    setDots(newDots);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-50/50 pt-32 pb-24"
    >
      {/* 1. INTERACTIVE GRID */}
      <div className="absolute inset-0 z-0 px-[8%] py-[10%] opacity-60 pointer-events-none select-none">
        <div className="relative w-full h-full">
          {dots.map((dot) => (
            <InteractiveDot
              key={dot.id}
              baseX={dot.baseX}
              baseY={dot.baseY}
              mouseX={mouseX}
              mouseY={mouseY}
              containerRef={containerRef}
            />
          ))}
        </div>
      </div>

      {/* 2. AMBIENT GLOW */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-indigo-100/40 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* 3. TWO-COLUMN LAYOUT */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT: TEXT CONTENT */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start"
          >
            {/* HEADLINE */}
            {/* HEADLINE */}
            <motion.h1
              variants={itemVariants}
              className="font-black text-slate-950 tracking-tighter leading-[1.1] max-w-2xl mb-6"
            >
              {/* Teks Utama: Dibuat Lebih Besar */}
              <span className="text-4xl sm:text-5xl md:text-6xl block mb-2">
                Jasa Buat Website
              </span>

              {/* Teks Pendukung: Dibuat Lebih Kecil & Proporsional */}
              <span className="relative inline-block text-2xl sm:text-3xl md:text-4xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 block">
                  dengan Desain Mewah,
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 block">
                  Akses Super Cepat.
                </span>

                {/* Animated underline */}
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    delay: 1.0,
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ transformOrigin: "left" }}
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                />
              </span>
            </motion.h1>

            {/* SUB-HEADLINE */}
            <motion.p
              variants={itemVariants}
              className="text-slate-500 max-w-xl text-sm sm:text-base font-normal leading-relaxed mb-8"
            >
              Percayakan pembuatan website bisnis Anda di{" "}
              <span className="font-semibold text-blue-600">CodeWebs.</span>{" "}
              Kami membangun platform kustom yang profesional, aman, dan
              dirancang khusus untuk meningkatkan penjualan serta kepercayaan
              pelanggan Anda.
            </motion.p>

            {/* TRUST INDICATORS */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 mb-8"
            >
              {[
                { icon: "⚡", label: "99/100 PageSpeed" },
                { icon: "🔒", label: "SSL & Secure" },
                { icon: "🚀", label: "Deploy dalam 14 Hari" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 text-xs text-slate-500"
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA BUTTONS */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 items-start w-full max-w-md"
            >
              <a
                href="#order"
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 text-white text-xs font-bold tracking-widest uppercase py-4 px-8 rounded-full transition-all duration-300 shadow-xl shadow-slate-900/10 hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-500/30 active:scale-98"
              >
                Simulasi Harga Presisi
                <span className="transform group-hover:translate-x-1 transition-transform duration-200 text-sm">
                  →
                </span>
              </a>

              <a
                href="#portfolio"
                className="w-full sm:w-auto inline-flex items-center justify-center border border-slate-200 bg-white/80 backdrop-blur-md text-slate-800 text-xs font-bold tracking-widest uppercase py-4 px-8 rounded-full hover:bg-slate-900 hover:border-slate-900 hover:text-white transition-all duration-300 active:scale-98"
              >
                Eksplorasi Karya
              </a>
            </motion.div>

            {/* SOCIAL PROOF */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {[
                  "bg-blue-400",
                  "bg-indigo-400",
                  "bg-violet-400",
                  "bg-sky-400",
                ].map((color, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-full ${color} border-2 border-white flex items-center justify-center text-[8px] text-white font-bold`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500">
                <span className="font-bold text-slate-800">40+ klien</span>{" "}
                sudah percaya
              </p>
            </motion.div>
          </motion.div>

          {/* RIGHT: BROWSER MOCKUP ILLUSTRATION */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block"
          >
            {/* Subtle floating animation wrapper */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
              style={{ perspective: "800px" }}
            >
              {/* Decorative ring behind mockup */}
              <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-blue-100/60 via-indigo-50/40 to-slate-100/60 blur-xl pointer-events-none" />

              {/* Tilt wrapper */}
              <TiltCard>
                <div className="relative w-full" style={{ paddingTop: "66%" }}>
                  <div className="absolute inset-0">
                    <BrowserMockup />
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Decorative geometry */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -z-10 top-1/2 right-0 w-48 h-48 border border-blue-200/40 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -z-10 top-1/2 right-8 w-32 h-32 border border-indigo-200/40 rounded-full"
            />
          </motion.div>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-slate-400 tracking-widest uppercase font-semibold">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 border-2 border-slate-300 rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 bg-slate-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// =======================================================
// Sub-Komponen: 3D Tilt Card
// =======================================================
function TiltCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    rotateY.set(deltaX * 6);
    rotateX.set(-deltaY * 4);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="cursor-pointer"
    >
      {children}
    </motion.div>
  );
}

// =======================================================
// Sub-Komponen: Titik Digital Interaktif
// =======================================================
function InteractiveDot({ baseX, baseY, mouseX, mouseY, containerRef }: any) {
  const dotRef = useRef<HTMLDivElement>(null);

  const translateX = useSpring(0, SPRING_CONFIG);
  const translateY = useSpring(0, SPRING_CONFIG);
  const dotScale = useSpring(1, { stiffness: 200, damping: 15 });

  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const unsubscribeX = mouseX.on("change", checkDistance);
    const unsubscribeY = mouseY.on("change", checkDistance);

    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, []);

  const checkDistance = () => {
    if (!dotRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    const dotAbsoluteX =
      (baseX / 100) * containerRect.width + containerRect.left;
    const dotAbsoluteY =
      (baseY / 100) * containerRect.height + containerRect.top;

    const deltaX = mouseX.get() + containerRect.left - dotAbsoluteX;
    const deltaY = mouseY.get() + containerRect.top - dotAbsoluteY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < MOUSE_RADIUS) {
      const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
      const angle = Math.atan2(deltaY, deltaX);

      const pushX = -Math.cos(angle) * force * MOUSE_RADIUS * 0.45;
      const pushY = -Math.sin(angle) * force * MOUSE_RADIUS * 0.45;

      translateX.set(pushX);
      translateY.set(pushY);
      dotScale.set(1.8);
      setIsNear(true);
    } else {
      translateX.set(0);
      translateY.set(0);
      dotScale.set(1);
      setIsNear(false);
    }
  };

  return (
    <motion.div
      ref={dotRef}
      style={{
        position: "absolute",
        left: `${baseX}%`,
        top: `${baseY}%`,
        x: translateX,
        y: translateY,
        scale: dotScale,
      }}
      className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
        isNear
          ? "bg-blue-600 shadow-md shadow-blue-400/80 z-20"
          : "bg-slate-300/80 z-10"
      }`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.8,
          ease: "easeOut",
          delay: (baseX / 100) * 0.5 + (baseY / 100) * 0.3,
        },
      }}
    />
  );
}
