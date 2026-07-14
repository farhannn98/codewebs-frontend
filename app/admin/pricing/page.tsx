"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";

type PackageType = "foundation" | "infrastructure" | "addon";

interface PackageItem {
  id: number;
  type: PackageType;
  name: string;
  price: number;
}

export default function PricingSettingsPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);

  // State untuk Edit
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState<number>(0);

  // State untuk Tambah Data Baru
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState<string>("");
  const [newType, setNewType] = useState<PackageType>("foundation");

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/service-packages");
      const result = await res.json();

      if (result.success) {
        setPackages(result.data);
      } else {
        // Jika request berhasil tapi data error (misal token expired/validasi)
        toast.error("Gagal memuat data paket.");
      }
    } catch (error) {
      // Memberikan feedback jika koneksi ke server gagal total
      console.error("Gagal mengambil data harga:", error);
      toast.error("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  // FUNGSI UTAMAKAN TAMBAH DATA BARU
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice) {
      toast.error("Nama dan harga harus diisi, bro!");
      return;
    }

    // Kita gunakan toast.promise untuk menangani proses POST
    toast.promise(
      fetch("http://127.0.0.1:8000/api/service-packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: newType,
          name: newName,
          price: Number(newPrice),
        }),
      }).then(async (res) => {
        const result = await res.json();
        if (!res.ok || !result.success) throw new Error("Gagal menambah data.");

        setPackages([...packages, result.data]);
        setNewName("");
        setNewPrice("");
        return result;
      }),
      {
        loading: "Sedang menambahkan paket baru...",
        success: `Sukses menambahkan ${newName}!`,
        error: "Gagal menambahkan data.",
      },
    );
  };

  const startEdit = (item: PackageItem) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditPrice(item.price);
  };

  const handleSave = async (id: number) => {
    toast.promise(
      fetch(`http://127.0.0.1:8000/api/service-packages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          price: editPrice,
        }),
      }).then(async (res) => {
        const result = await res.json();
        if (!res.ok || !result.success) {
          throw new Error(result.message || "Gagal memperbarui.");
        }

        setPackages(
          packages.map((p) =>
            p.id === id ? { ...p, name: editName, price: editPrice } : p,
          ),
        );
        setEditingId(null);
        return result;
      }),
      {
        loading: "Sedang menyimpan perubahan...",
        success: "Harga paket berhasil diperbarui!",
        error: (err) => err.message,
      },
    );
  };

  // FUNGSI HAPUS DATA (BARU)
  const handleDelete = async (id: number, name: string) => {
    // Langsung tampilkan toast dengan tombol aksi
    toast(`Yakin mau menghapus opsi "${name}" ini, bro?`, {
      duration: 10000, // Biarkan muncul lebih lama agar user sempat baca
      action: {
        label: "Hapus",
        onClick: async () => {
          // Eksekusi hapus menggunakan toast.promise agar ada loadingnya
          toast.promise(
            fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/service-packages/${id}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  "Content-Type": "application/json",
                },
              },
            ).then(async (res) => {
              const result = await res.json();
              if (!res.ok || !result.success)
                throw new Error("Gagal menghapus.");

              // Filter state lokal
              setPackages((prev) => prev.filter((p) => p.id !== id));
              return result;
            }),
            {
              loading: "Sedang menghapus...",
              success: "Opsi berhasil dihapus!",
              error: "Gagal menghapus data.",
            },
          );
        },
      },
      // Hapus properti 'cancel' jika itu yang menyebabkan error
    });
  };

  if (loading) {
    return (
      <div className="text-center font-bold p-12 text-slate-900">
        Memuat Data Harga...
      </div>
    );
  }

  const renderTableByType = (targetType: PackageType, title: string) => {
    const filtered = packages.filter((p) => p.type === targetType);

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-black text-slate-800 uppercase tracking-wider">
          {title}
        </h3>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest w-1/2">
                  Nama Opsi / Paket
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest w-1/4">
                  Harga (Rp)
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border border-slate-200 rounded-xl px-3 py-1.5 text-sm w-full font-bold text-slate-900 focus:outline-blue-500"
                      />
                    ) : (
                      item.name
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {editingId === item.id ? (
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="border border-slate-200 rounded-xl px-3 py-1.5 text-sm w-full font-bold text-slate-900 focus:outline-blue-500"
                      />
                    ) : (
                      `Rp ${item.price.toLocaleString("id-ID")}`
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingId === item.id ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleSave(item.id)}
                          className="bg-blue-600 text-white px-3 py-1.5 rounded-xl font-bold text-xs hover:bg-blue-700"
                        >
                          SIMPAN
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl font-bold text-xs hover:bg-slate-300"
                        >
                          BATAL
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-4 items-center">
                        <button
                          onClick={() => startEdit(item)}
                          className="text-blue-600 hover:text-blue-800 font-bold text-xs"
                        >
                          EDIT HARGA
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="text-red-500 hover:text-red-700 font-bold text-xs"
                        >
                          HAPUS
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-8 text-center text-sm text-slate-400 font-medium"
                  >
                    Belum ada opsi untuk kategori ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
          Pricing Settings
        </h2>
        <p className="text-slate-500 font-medium mt-1">
          Kelola dan tambah opsi paket kalkulator website agensi lu secara
          real-time.
        </p>
      </div>

      {/* FORM TAMBAH JENIS / KATEGORI BARU */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-md font-bold tracking-tight">
          ➕ Tambah Opsi / Paket Baru
        </h3>
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Pilih Kelompok Tabel
            </label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as PackageType)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="foundation">1. Tipe Fondasi Website</option>
              <option value="infrastructure">2. Paket Infrastruktur</option>
              <option value="addon">3. Fitur Tambahan</option>
            </select>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Nama Jenis Baru
            </label>
            <input
              type="text"
              placeholder="Contoh: Company Profile"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Harga Dasar (Rp)
            </label>
            <input
              type="number"
              placeholder="Contoh: 3500000"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white font-bold text-sm px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors h-[38px] w-full"
          >
            TAMBAHKAN
          </button>
        </form>
      </div>

      <div className="space-y-10">
        {renderTableByType("foundation", "1. Tipe Fondasi Website")}
        {renderTableByType("infrastructure", "2. Paket Infrastruktur")}
        {renderTableByType("addon", "3. Fitur Tambahan")}
      </div>
    </div>
  );
}
