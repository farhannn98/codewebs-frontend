"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";

interface PortfolioItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  description: string;
  features: string[];
  tech_stack: string[];
  total_investment: number;
  timeline: string;
  complexity: "Low" | "Medium" | "High";
  demo_url: string;
  image_path: string;
  status: "Published" | "Draft";
}

export default function PortofolioSection() {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [filteredPortfolios, setFilteredPortfolios] = useState<PortfolioItem[]>(
    [],
  );
  const [selectedCategory, setSelectedCategory] = useState("SEMUA");
  const [loading, setLoading] = useState(true);

  // State Modal Detail
  const [activeProject, setActiveProject] = useState<PortfolioItem | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ["SEMUA", "LANDING PAGE", "WEB APP", "E-COMMERCE"];

  useEffect(() => {
    fetchPublicPortfolios();
  }, []);

  const fetchPublicPortfolios = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/portfolios`,
      );
      const result = await res.json();
      if (result.success) {
        // Hanya nampilin yang udah Published bro
        const publishedData = result.data.filter(
          (item: PortfolioItem) => item.status === "Published",
        );
        setPortfolios(publishedData);
        setFilteredPortfolios(publishedData);
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengambil galeri karya portfolio.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === "SEMUA") {
      setFilteredPortfolios(portfolios);
    } else {
      const filtered = portfolios.filter(
        (item) => item.category.toUpperCase() === category.toUpperCase(),
      );
      setFilteredPortfolios(filtered);
    }
  };

  const getWhatsAppLink = (projectTitle: string) => {
    const baseNumber = "628xxxxxxxxxx"; // <— Ganti pake nomor WA lu sendiri, bro!
    const message = `Halo gan, saya melihat portofolio proyek "${projectTitle}" di website Studio Anda. Saya tertarik untuk berkonsultasi mengenai pembuatan proyek serupa.`;
    return `https://wa.me/${baseNumber}?text=${encodeURIComponent(message)}`;
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-xs font-black text-slate-400 uppercase tracking-widest">
        Memuat Portofolio Studio...
      </div>
    );
  }

  return (
    <section
      id="portfolio"
      className="bg-[#f8fafc] py-20 px-6 sm:px-12 lg:px-24 font-sans antialiased selection:bg-blue-600 selection:text-white"
    >
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-xs font-black uppercase text-blue-600 tracking-widest block mb-2.5">
            — CASE STUDIES / HASIL KARYA
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
            Eksplorasi <br className="hidden md:block" />
            <span className="text-blue-600 font-black">Proyek Studio.</span>
          </h2>
        </div>
        <p className="text-slate-400 font-bold text-xs sm:text-sm max-w-xs md:text-right leading-relaxed">
          Klik kartu untuk melihat rincian biaya, stack teknologi, dan
          spesifikasi teknis proyek.
        </p>
      </div>

      {/* FILTER TABS */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-6 mb-10">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-[11px] font-black tracking-wider uppercase transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-[#1e293b] text-white shadow-md shadow-slate-900/10"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-slate-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <span className="text-xs font-black text-slate-400 tracking-wider uppercase">
          {filteredPortfolios.length} proyek
        </span>
      </div>

      {/* PORTFOLIO GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPortfolios.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setActiveProject(item)}
            className="group relative h-[340px] rounded-[32px] overflow-hidden cursor-pointer border border-slate-100/10 shadow-xs hover:shadow-xl transition-all duration-500 bg-slate-900"
          >
            {/* Cover Project */}
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${item.image_path}`}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-102 transition-transform duration-700"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/600x400/1e293b/ffffff?text=Studio+Project";
              }}
            />

            {/* Premium Gradient Shadow overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent transition-all duration-500" />

            {/* Badges Atas */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
              <span className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-[11px] font-black text-blue-400">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase text-white tracking-widest">
                {item.category}
              </span>
            </div>

            {/* INFO PANEL BAWAH (HARGA & JUDUL SELALU MUNCUL SEJAK AWAL) */}
            <div className="absolute bottom-0 inset-x-0 p-6 z-10 flex flex-col justify-end h-1/2">
              <h3 className="text-xl font-black text-white tracking-tight leading-tight">
                {item.title}
              </h3>

              {/* Deskripsi pendek opsional */}
              <p className="text-[11px] text-slate-400 font-medium line-clamp-1 mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
                {item.description}
              </p>

              {/* BARIS DATA UTAMA: HARGA & CALL ACTION */}
              <div className="flex items-end justify-between pt-3 mt-3 border-t border-white/10">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                    Mulai dari
                  </span>
                  <span className="text-base font-black text-white tracking-tight mt-0.5">
                    Rp {Number(item.total_investment).toLocaleString("id-ID")}
                  </span>
                </div>

                {/* Efek interaktif tulisan Lihat Detail baru bergeser/menyala pas di-hover */}
                <span className="text-[11px] font-black text-blue-400 inline-flex items-center gap-1 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  Lihat Detail{" "}
                  <i className="fa-solid fa-arrow-right text-[9px]"></i>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================== */}
      {/* MODAL DETAIL PROYEK (DARK LUXURY STYLE) */}
      {/* ========================================== */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0f172a] border border-slate-800/80 rounded-[32px] max-w-4xl w-full overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-200">
            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-5 right-5 z-30 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-rose-600 border border-white/10 flex items-center justify-center text-white transition-all cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>

            {/* Banner Atas */}
            <div className="relative h-64 sm:h-80 w-full bg-slate-900">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${activeProject.image_path}`}
                alt={activeProject.title}
                className="w-full h-full object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/30 to-black/10" />
              <div className="absolute bottom-6 left-6 sm:left-10 z-10 space-y-1">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-[10px] font-black uppercase text-blue-400 tracking-widest inline-block">
                  {activeProject.category}
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tighter mt-1">
                  {activeProject.title}
                </h3>
              </div>
            </div>

            {/* Isian Spek Detail */}
            <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-6">
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                  {activeProject.description}
                </p>

                {activeProject.features &&
                  activeProject.features.length > 0 && (
                    <div className="space-y-3">
                      <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                        FITUR TERPASANG
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeProject.features.map((feat, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-900/60 border border-slate-800/50 rounded-xl px-4 py-3 flex items-center gap-2.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-xs font-bold text-slate-300 truncate">
                              {feat}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {activeProject.tech_stack &&
                  activeProject.tech_stack.length > 0 && (
                    <div className="space-y-3">
                      <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                        TECH STACK
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {activeProject.tech_stack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-900 border border-slate-800 text-slate-400 text-[11px] font-bold px-3 py-1.5 rounded-lg"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* BARU: TOMBOL KUNJUNGI WEBSITE & KONSULTASI WHATSAPP */}
                <div className="flex flex-col gap-2 pt-2">
                  {/* Tombol Kunjungi Website (Hanya muncul jika demo_url ada isinya) */}
                  {activeProject.demo_url ? (
                    <a
                      href={activeProject.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 border border-slate-700"
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square text-xs text-blue-400"></i>{" "}
                      KUNJUNGI LIVE WEBSITE
                    </a>
                  ) : (
                    <div className="text-center text-[11px] text-slate-500 font-medium py-1 bg-slate-950/30 rounded-lg border border-slate-900/50">
                      🔒 Link demo privat / khusus internal
                    </div>
                  )}

                  {/* Tombol WhatsApp lama tetap setia menemani */}
                  {/* <a
                    href={getWhatsAppLink(activeProject.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <i className="fa-brands fa-whatsapp text-sm"></i> KONSULTASI
                    PROYEK SERUPA
                  </a> */}
                </div>
              </div>

              {/* Sidebar Investasi */}
              <div className="lg:col-span-5">
                <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 space-y-6">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest pb-3 border-b border-slate-800">
                    INVESTASI & TIMELINE
                  </h4>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                      TOTAL INVESTASI
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-blue-400 tracking-tight block mt-0.5">
                      Rp{" "}
                      {Number(activeProject.total_investment).toLocaleString(
                        "id-ID",
                      )}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">
                        ESTIMASI SELESAI
                      </span>
                      <span className="text-sm font-black text-white flex items-center gap-1.5 mt-1">
                        <i className="fa-regular fa-clock text-slate-400"></i>{" "}
                        {activeProject.timeline}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">
                        KOMPLEKSITAS
                      </span>
                      <div className="w-full mt-2">
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-blue-500 ${
                              activeProject.complexity === "Low"
                                ? "w-1/3"
                                : activeProject.complexity === "Medium"
                                  ? "w-2/3"
                                  : "w-full"
                            }`}
                          />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mt-1">
                          {activeProject.complexity} PROYEK
                        </span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={getWhatsAppLink(activeProject.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-2"
                  >
                    <i className="fa-brands fa-whatsapp text-sm"></i> KONSULTASI
                    PROYEK SERUPA
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
