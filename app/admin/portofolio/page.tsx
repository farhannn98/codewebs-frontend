"use client";

import React, { useState, useEffect, useRef } from "react";
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
  complexity: string;
  demo_url: string;
  image_path: string;
  status: "Published" | "Draft";
  created_at: string;
}

export default function AdminPortfolioPage() {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  // State Modal CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // State Tampungan Form Inputs
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Landing Page");
  const [description, setDescription] = useState("");
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [timeline, setTimeline] = useState("");
  const [complexity, setComplexity] = useState("Medium");
  const [demoUrl, setDemoUrl] = useState("");
  const [status, setStatus] = useState<"Published" | "Draft">("Draft");

  // State untuk Input Dinamis (Fitur Terpasang)
  const [features, setFeatures] = useState<string[]>([""]);

  // State untuk Pilihan Tech Stack (Checkbox / Tags)
  const availableTech = [
    "Next.js",
    "React",
    "Laravel",
    "Tailwind CSS",
    "Framer Motion",
    "Filament",
    "MySQL",
    "TypeScript",
  ];
  const [techStack, setTechStack] = useState<string[]>([]);

  // State File Gambar
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/portfolios`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`, // Biar aman kalau rute index di-protect admin
          },
        },
      );
      const result = await res.json();
      if (result.success) {
        setPortfolios(result.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengambil data portofolio dari server.");
    } finally {
      setLoading(false);
    }
  };

  // Handler Input Dinamis Fitur
  const handleAddFeature = () => setFeatures([...features, ""]);
  const handleRemoveFeature = (index: number) => {
    const updated = features.filter((_, i) => i !== index);
    setFeatures(updated.length ? updated : [""]);
  };
  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  // Handler Pilihan Tech Stack
  const handleTechCheckbox = (tech: string) => {
    if (techStack.includes(tech)) {
      setTechStack(techStack.filter((t) => t !== tech));
    } else {
      setTechStack([...techStack, tech]);
    }
  };

  // Buka Modal Tambah Baru
  const openAddModal = () => {
    setEditingId(null);
    setTitle("");
    setCategory("Landing Page");
    setDescription("");
    setFeatures([""]);
    setTechStack([]);
    setTotalInvestment(0);
    setTimeline("");
    setComplexity("Medium");
    setDemoUrl("");
    setStatus("Draft");
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsModalOpen(true);
  };

  // Buka Modal Edit
  const openEditModal = (item: PortfolioItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category || "Landing Page");
    setDescription(item.description || "");
    setFeatures(Array.isArray(item.features) ? item.features : [""]);
    setTechStack(Array.isArray(item.tech_stack) ? item.tech_stack : []);
    setTotalInvestment(item.total_investment || 0);
    setTimeline(item.timeline || "");
    setComplexity(item.complexity || "Medium");
    setDemoUrl(item.demo_url || "");
    setStatus(item.status || "Draft");
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsModalOpen(true);
  };

  // Submit Form Menggunakan FormData (Wajib karena ada Upload File)
  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("total_investment", String(totalInvestment));
    formData.append("timeline", timeline);
    formData.append("complexity", complexity);
    formData.append("demo_url", demoUrl);
    formData.append("status", status);

    // Filter fitur kosong
    const cleanFeatures = features.filter((f) => f.trim() !== "");
    cleanFeatures.forEach((f, index) => {
      formData.append(`features[${index}]`, f);
    });

    // Append Tech Stack Array
    techStack.forEach((t, index) => {
      formData.append(`tech_stack[${index}]`, t);
    });

    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Jika mode edit, tambahkan spoofing method PUT untuk Laravel FormData
    if (editingId) {
      formData.append("_method", "PUT");
    }

    try {
      const url = editingId
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/portfolios/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/portfolios`;

      const res = await fetch(url, {
        method: "POST", // Tetap POST karena membawa multipart file, Laravel membaca spoofing _method di atas
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          // Catatan: Jangan pasang Content-Type di sini karena menggunakan FormData!
        },
        body: formData,
      });

      const result = await res.json();
      if (res.ok && result.success) {
        toast.success(result.message || "Portofolio berhasil disimpan!");
        setIsModalOpen(false);
        fetchPortfolios();
      } else {
        toast.error(result.message || "Gagal memproses portofolio.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan sistem saat menghubungi server.");
    }
  };

  // Hapus Portofolio Premium via Sonner Confirmation
  const handleDeletePortfolio = (id: number) => {
    toast("Hapus Portofolio?", {
      description: "Data dan file cover proyek ini akan dihapus permanen, bro.",
      action: {
        label: "Hapus",
        onClick: async () => {
          const token = localStorage.getItem("token");
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/portfolios/${id}`,
              {
                method: "DELETE",
                headers: {
                  Accept: "application/json",
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            const result = await res.json();
            if (result.success) {
              toast.success(result.message || "Berhasil dihapus!");
              fetchPortfolios();
            } else {
              toast.error(result.message || "Gagal menghapus.");
            }
          } catch (e) {
            toast.error("Gagal menghapus akibat gangguan koneksi server.");
          }
        },
      },
      cancel: { label: "Batal", onClick: () => toast.dismiss() },
    });
  };

  if (loading) {
    return (
      <div className="p-12 text-center font-bold text-slate-800">
        Memuat Manajer Portofolio...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
            Showcase Portfolios
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Kelola galeri hasil karya pameran proyek website agensi lu langsung
            ke halaman depan.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wider uppercase px-4 py-3 rounded-xl transition-all shadow-md inline-flex items-center gap-2"
        >
          <i className="fa-solid fa-plus text-xs"></i> Tambah Portofolio Baru
        </button>
      </div>

      {/* PORTFOLIO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.length === 0 ? (
          <div className="col-span-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-800 font-medium">
            Belum ada portofolio terpasang. Klik tombol di atas untuk menambah
            karya pertamamu, bro!
          </div>
        ) : (
          portfolios.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between p-1"
            >
              <div>
                {/* COVER IMAGE */}
                <div className="relative h-48 bg-slate-50 w-full overflow-hidden rounded-xl border border-slate-100">
                  {item.image_path ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${item.image_path}`}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/600x400/f8fafc/cbd5e1?text=Image+Not+Found";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">
                      No Image Preview
                    </div>
                  )}
                  <span
                    className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${item.status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* TEXT CONTENT */}
                <div className="p-4 space-y-3">
                  <div>
                    <span className="text-[9px] font-black uppercase text-blue-600 tracking-widest block">
                      {item.category}
                    </span>
                    <h4 className="font-black text-base text-slate-900 tracking-tight leading-snug mt-0.5">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  </div>

                  {/* TIMELINE & KOMPLEKSITAS */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100/50 text-[11px] font-bold text-slate-600">
                    <div className="inline-flex items-center gap-1.5">
                      <i className="fa-regular fa-clock text-slate-400 text-xs"></i>
                      <span>Durasi: {item.timeline || "-"}</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5">
                      <i className="fa-solid fa-chart-simple text-slate-400 text-xs"></i>
                      <span>Level: {item.complexity || "-"}</span>
                    </div>
                  </div>

                  {/* FITUR TERPASANG */}
                  {item.features && item.features.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">
                        Fitur Utama:
                      </span>
                      <ul className="text-[11px] text-slate-600 font-medium space-y-0.5 list-disc list-inside">
                        {item.features.map((feature, fIdx) => (
                          <li key={fIdx} className="truncate">
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* TECH STACK */}
                  {item.tech_stack && item.tech_stack.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">
                        Tech Stack:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {item.tech_stack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="bg-slate-100 text-slate-700 font-bold text-[10px] px-2 py-0.5 rounded-md border border-slate-200/40"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* FOOTER CARD */}
              <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-50 mt-2">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase text-slate-800 tracking-wider">
                    Investasi
                  </span>
                  <span className="font-black text-blue-600 text-sm">
                    Rp{" "}
                    {Number(item.total_investment || 0).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="bg-slate-50 hover:bg-blue-600 text-slate-600 hover:text-white p-2 rounded-xl transition-colors text-xs border border-slate-100"
                    title="Edit"
                  >
                    <i className="fa-solid fa-pen-to-square w-3.5 h-3.5 flex items-center justify-center"></i>
                  </button>
                  <button
                    onClick={() => handleDeletePortfolio(item.id)}
                    className="bg-slate-50 hover:bg-rose-600 text-slate-600 hover:text-white p-2 rounded-xl transition-colors text-xs border border-slate-100"
                    title="Hapus"
                  >
                    <i className="fa-solid fa-trash-can w-3.5 h-3.5 flex items-center justify-center"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL FORM CRUD DIALOG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-100 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {editingId
                  ? "Edit Detail Portofolio"
                  : "Tambah Karya Portofolio Baru"}
              </h3>
              <p className="text-xs text-slate-800 font-medium mt-0.5">
                Lengkapi data di bawah ini agar sinkron dengan visualisasi
                detail proyek mewah lu.
              </p>
            </div>

            <form onSubmit={handleSavePortfolio} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-800 tracking-wider">
                    Judul Proyek
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border border-slate-200 rounded-xl text-slate-800  px-4 py-2 text-sm focus:outline-blue-500 font-medium"
                    placeholder="Contoh: Lumière Furniture Studio"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-800 tracking-wider">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border border-slate-200 rounded-xl text-slate-800 px-4 py-2.5 text-sm font-bold text-slate-700 bg-white focus:outline-blue-500"
                  >
                    <option value="Landing Page">Landing Page Premium</option>
                    <option value="E-Commerce">E-Commerce System</option>
                    <option value="Web Application">
                      Web Application / SaaS
                    </option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-800 tracking-wider">
                  Deskripsi Proyek
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="border border-slate-200 rounded-xl text-slate-800 px-4 py-2 text-sm focus:outline-blue-500 font-medium"
                  placeholder="Tulis rincian cerita pengerjaan, tantangan, atau konsep proyek..."
                />
              </div>

              {/* INPUT DINAMIS UNTUK FITUR TERPASANG */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-800 tracking-wider flex justify-between items-center">
                  Fitur Terpasang
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="text-blue-600 hover:text-blue-700 text-slate-800 font-black normal-case text-xs inline-flex items-center gap-1"
                  >
                    + Tambah Fitur
                  </button>
                </label>
                <div className="space-y-2">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) =>
                          handleFeatureChange(idx, e.target.value)
                        }
                        className="flex-1 border border-slate-200 text-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-blue-500 font-medium"
                        placeholder="Misal: Desain 3D Carousel Interaktif, Sistem Hitung Otomatis"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-colors"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* PILIHAN TECH STACK CHECKBOX */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-800 tracking-wider">
                  Teknologi yang Digunakan (Tech Stack)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {availableTech.map((tech) => (
                    <label
                      key={tech}
                      className="flex items-center gap-2 text-xs text-slate-700 font-bold cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={techStack.includes(tech)}
                        onChange={() => handleTechCheckbox(tech)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 border-slate-300"
                      />
                      {tech}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-800 tracking-wider">
                    Nilai Investasi (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={totalInvestment}
                    onChange={(e) => setTotalInvestment(Number(e.target.value))}
                    className="border border-slate-200 rounded-xl px-4 py-2 text-sm text-blue-600 font-black focus:outline-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-800 tracking-wider">
                    Durasi Pengerjaan (Timeline)
                  </label>
                  <input
                    type="text"
                    required
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="border border-slate-200 rounded-xl px-4 text-slate-800 py-2 text-sm focus:outline-blue-500 font-medium"
                    placeholder="Contoh: 7 Hari, 2 Minggu"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-800 tracking-wider">
                    Kompleksitas
                  </label>
                  <select
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value)}
                    className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 bg-white focus:outline-blue-500"
                  >
                    <option value="Low">Low Complexity</option>
                    <option value="Medium">Medium Complexity</option>
                    <option value="High">High Complexity</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-800 tracking-wider">
                    Link Live Demo (URL Web Jadi)
                  </label>
                  <input
                    type="url"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    className="border border-slate-200 rounded-xl px-4 text-slate-800 py-2 text-sm focus:outline-blue-500 font-medium"
                    placeholder="https://lumiere-furniture.vercel.app"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-800 tracking-wider">
                    Status Publikasi
                  </label>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as "Published" | "Draft")
                    }
                    className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 bg-white focus:outline-blue-500"
                  >
                    <option value="Draft">Draft (Simpan Saja)</option>
                    <option value="Published">
                      Published (Tampilkan di Depan)
                    </option>
                  </select>
                </div>
              </div>

              {/* UPLOAD FILE IMAGE COVER */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-800 tracking-wider">
                  Cover Project Image{" "}
                  {editingId && (
                    <span className="text-amber-500 lowercase font-medium">
                      (Kosongkan jika tidak ingin ganti gambar)
                    </span>
                  )}
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  required={!editingId}
                  onChange={(e) =>
                    setImageFile(e.target.files ? e.target.files[0] : null)
                  }
                  className="border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-500 focus:outline-blue-500"
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-colors shadow-md"
                >
                  Simpan Portofolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
