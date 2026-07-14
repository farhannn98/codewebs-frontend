"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 1. DATA PERTANYAAN & JAWABAN (Copywriting Strategis)
const FAQ_ITEMS = [
  {
    id: 1,
    question:
      "Apakah website di TheWebOrder menggunakan template instan seperti WordPress?",
    answer:
      "Sama sekali tidak. Kami membangun setiap baris kode secara kustom dari nol (Bespoke Code) menggunakan Next.js untuk tampilan depan dan Laravel untuk sistem belakang. Hasilnya, website Anda jauh lebih unik, tidak bisa ditiru kompetitor, memiliki keamanan tingkat tinggi, dan kecepatan akses yang instan.",
  },
  {
    id: 2,
    question:
      "Saya tidak paham coding, apakah nanti saya bisa mengubah konten website sendiri?",
    answer:
      "Sangat bisa dan mudah sekali. Setiap website yang kami rancang sudah terintegrasi langsung dengan Filament Admin Panel. Anda bisa menambah produk, mengubah teks, mengganti gambar, hingga memantau data secara mandiri melalui dashboard admin yang intuitif—semudah mengetik di Microsoft Word.",
  },
  {
    id: 3,
    question:
      "Apakah ada biaya langganan bulanan tersembunyi dari pihak agensi?",
    answer:
      "Tidak ada. Kami menjunjung tinggi transparansi penuh. Biaya yang Anda investasikan di awal murni untuk lisensi pengembangan website kustom Anda. Biaya di tahun-tahun berikutnya murni hanya untuk perpanjangan sewa Domain dan Hosting pihak ketiga pilihan Anda, tanpa ada potongan komisi dari kami.",
  },
  {
    id: 4,
    question:
      "Bisakah saya menambah fitur baru di kemudian hari jika bisnis saya berkembang?",
    answer:
      "Tentu saja bisa. Karena sistem kami dibangun di atas arsitektur kode yang bersih dan terstruktur (clean code), website Anda memiliki tingkat skalabilitas yang sangat tinggi. Kapan pun Anda ingin menambah fitur kompleks (seperti sistem membership atau payment gateway), kami siap mengeksekusinya tanpa perlu merombak sistem dari awal.",
  },
];

export default function FAQ() {
  // State untuk menyimpan ID item yang sedang terbuka
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      id="faq"
      className="relative bg-white py-24 border-t border-slate-100 overflow-hidden"
    >
      {/* ORNAMEN BACKGROUND GLOW HALUS */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-50 rounded-full blur-[130px] pointer-events-none -z-10 -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-4xl mx-auto px-6">
        {/* HEADER SECTION */}
        <div className="text-center mb-20">
          <span className="text-[10px] tracking-[0.2em] font-black text-blue-600 uppercase block mb-3">
            Tanya Jawab / FAQ
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Pertanyaan yang Sering Diajukan.
          </h2>
          <p className="text-slate-500 text-sm font-medium max-w-xl mx-auto leading-relaxed">
            Punya keraguan atau pertanyaan seputar arsitektur teknologi dan alur
            kerja kami? Temukan jawaban transparannya langsung di bawah ini.
          </p>
        </div>

        {/* ACCORDION CONTAINER */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className={`border rounded-2xl transition-all duration-300 ${
                  isOpen
                    ? "border-slate-900 bg-slate-50/50 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-400"
                }`}
              >
                {/* TOMBOL PEMICU/TRIGGER */}
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full flex items-center justify-between text-left p-6 sm:p-8 cursor-pointer select-none"
                >
                  <span
                    className={`text-sm sm:text-base font-black tracking-tight pr-4 transition-colors duration-200 ${isOpen ? "text-blue-600" : "text-slate-900"}`}
                  >
                    {item.question}
                  </span>

                  {/* IKON INTERAKTIF */}
                  <div
                    className={`h-6 w-6 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? "border-slate-900 bg-slate-900 text-white rotate-45" : "border-slate-300 text-slate-500"}`}
                  >
                    <span className="text-xs font-bold leading-none">+</span>
                  </div>
                </button>

                {/* ANIMATED ANSWER CONTAINER */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: {
                          height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.25 },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.15 },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0 border-t border-slate-100">
                        <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed max-w-3xl">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
