"use client";

import { motion, Variants } from "framer-motion";

// 1. DATA ALUR KERJA (Materi Copywriting Premium)
const STEPS = [
  {
    number: "01",
    title: "Konsultasi & Cetak Biru",
    subtitle: "Discovery & Strategy",
    desc: "Kami membedah visi bisnis Anda, menganalisis kompetitor, dan merancang arsitektur fitur serta alur konversi yang bener-bener berdampak pada penjualan.",
  },
  {
    number: "02",
    title: "Desain Visual Eksklusif",
    subtitle: "Bespoke UI/UX Design",
    desc: "Tim kami merancang tampilan visual dari nol secara kustom (bukan template pasaran). Anda mendapatkan preview mockup interaktif yang elegan dan mewah sebelum kode ditulis.",
  },
  {
    number: "03",
    title: "Pemrograman Presisi",
    subtitle: "Precision Engineering",
    desc: "Desain yang disetujui dieksekusi dengan kode yang bersih menggunakan Next.js untuk performa depan yang instan, serta Laravel untuk jangkar sistem admin yang kokoh.",
  },
  {
    number: "04",
    title: "Optimasi & Serah Terima",
    subtitle: "Launch & Handover",
    desc: "Website diuji secara ketat (skor performa kecepatan & SEO). Kami bantu setup domain & hosting, serta memberikan panduan lengkap cara mengoperasikan dashboard admin Anda.",
  },
];

export default function Workflow() {
  // Konfigurasi Animasi Container
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Jeda antar kartu muncul
      },
    },
  };

  // Konfigurasi Animasi Tiap Kartu
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      id="workflow"
      className="relative bg-white py-24 border-t border-slate-100 overflow-hidden"
    >
      {/* DEKORASI BACKGROUND MINIMALIS */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-50 rounded-full blur-[120px] pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3" />

      <div className="max-w-6xl mx-auto px-6">
        {/* HEADER SECTION */}
        <div className="max-w-2xl mb-24">
          <span className="text-[10px] tracking-[0.2em] font-black text-blue-600 uppercase block mb-3">
            Metodologi Kerja / Workflow
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
            Bagaimana Kami <br />
            Mengeksekusi Ide Anda.
          </h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Setiap proyek dikerjakan melalui tahapan terstruktur yang transparan
            dan terukur untuk menjamin kualitas kode tertinggi serta keselarasan
            dengan identitas brand Anda.
          </p>
        </div>

        {/* WORKFLOW CARDS GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative"
        >
          {/* Garis Hubung Horizontal di Desktop */}
          <div className="hidden lg:block absolute top-[40px] left-6 right-6 h-[1px] bg-slate-100 z-0" />

          {STEPS.map((step, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative bg-white border border-slate-200/60 p-6 rounded-3xl transition-all duration-300 hover:border-slate-400 hover:shadow-xl hover:shadow-slate-100/50 flex flex-col justify-between h-[320px] z-10"
            >
              {/* Bagian Atas: Nomor Indeks & Subtitle */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  {/* Nomor Bulat Penanda */}
                  <div className="h-10 w-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-black text-slate-800 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-colors duration-300">
                    {step.number}
                  </div>
                  {/* Watermark Angka Besar Transparan */}
                  <span className="text-6xl font-black text-slate-100/70 select-none tracking-tighter group-hover:text-slate-200/50 transition-colors duration-300">
                    {step.number}
                  </span>
                </div>

                <span className="text-[9px] tracking-widest font-bold text-blue-600 uppercase block mb-1">
                  {step.subtitle}
                </span>
                <h3 className="text-base font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                  {step.title}
                </h3>
              </div>

              {/* Bagian Bawah: Deskripsi */}
              <div>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
