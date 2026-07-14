"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; // ➕ Import router Next.js

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const router = useRouter(); // ➕ Inisialisasi router

  const handleAdminAccess = () => {
    // Arahkan ke URL login rahasia lu, misal: /login-admin
    router.push("/login");
  };

  return (
    <footer className="relative bg-slate-950 text-slate-400 py-20 border-t border-slate-900 overflow-hidden">
      {/* ORNAMEN BACKGROUND GLOW BIRU LEMBUT */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* BAGIAN ATAS: BRAND & CALL TO ACTION GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-slate-900 items-start">
          {/* Kolom 1: Identitas Brand (6 Kolom) */}
          <div className="md:col-span-6 space-y-4">
            <h3 className="text-white text-xl font-black tracking-tight flex items-center gap-2">
              TheWebOrder<span className="text-blue-500">.</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-sm">
              Studio pengembangan website kustom premium. Kami merakit
              infrastruktur digital berperforma tinggi menggunakan arsitektur
              teknologi modern Next.js dan Laravel.
            </p>

            {/* Status Ketersediaan Proyek (Urgency Indicator) */}
            <div className="inline-flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-black text-slate-300 uppercase tracking-wider">
                Slot Proyek Mei: 1 Tersisa
              </span>
            </div>
          </div>

          {/* Kolom 2: Navigasi Cepat (3 Kolom) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-white text-xs font-black uppercase tracking-widest">
              Sitemap
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a
                  href="#portfolio"
                  className="hover:text-white transition-colors duration-200"
                >
                  Portfolio
                </a>
              </li>
              <li>
                <a
                  href="#workflow"
                  className="hover:text-white transition-colors duration-200"
                >
                  Metodologi
                </a>
              </li>
              <li>
                <a
                  href="#calculator"
                  className="hover:text-white transition-colors duration-200"
                >
                  Kalkulator Biaya
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="hover:text-white transition-colors duration-200"
                >
                  Tanya Jawab
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Kontak & Lokasi (3 Kolom) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-white text-xs font-black uppercase tracking-widest">
              Koneksi resmi
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a
                  href="https://wa.me/628123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-200"
                >
                  WhatsApp Bisnis
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-200"
                >
                  GitHub Enterprise
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-200"
                >
                  Instagram Studio
                </a>
              </li>
              <li className="text-slate-600 pt-2 border-t border-slate-900/50">
                Berbasis di Jepara, Indonesia
              </li>
            </ul>
          </div>
        </div>

        {/* BAGIAN BAWAH: HAK CIPTA & NOTASI TEKNIS */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-medium text-slate-600">
          <p>
            {/* 🛠️ DI SINI PERUBAHANNYA: Memisahkan simbol © agar bisa di-klik */}
            <span
              className="cursor-default select-none active:text-slate-500 transition-colors duration-150 pr-1"
              title="" // Dikosongkan agar tidak muncul tooltip text saat kursor di atasnya
            >
              ©
            </span>
            {currentYear} TheWebOrder. Farhan Ariyadi & Dani Laramda.
          </p>
          <div className="flex items-center gap-4">
            <span>Bespoke Architecture</span>
            <span className="h-1 w-1 rounded-full bg-slate-800" />
            <span>Next.js Engine v15</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
