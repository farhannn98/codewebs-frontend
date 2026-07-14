"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx"; // Import Excel
import jsPDF from "jspdf"; // Import jsPDF Core
import autoTable from "jspdf-autotable"; // Import jsPDF Table Plugin

interface OrderItem {
  id: number;
  client_name: string;
  whatsapp_number: string;
  package_foundation: string;
  package_infrastructure: string;
  additional_features: string[] | string;
  total_price: number;
  status: string;
  created_at: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  // State Pengendali Modal Form (Tambah & Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderItem | null>(null);

  // State tampungan data form input
  const [clientName, setClientName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [packageFoundation, setPackageFoundation] = useState("");
  const [packageInfrastructure, setPackageInfrastructure] = useState("");
  const [additionalFeatures, setAdditionalFeatures] = useState("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    fetchOrders();
  }, []);

  // Ambil Data dari API Backend
  const fetchOrders = async () => {
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        headers: {
          Accept: "application/json", // <-- TAMBAHKAN BARIS INI
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
      toast.error("Gagal mengambil data pesanan dari server.");
    } finally {
      setLoading(false);
    }
  };

  // Buka Modal Tambah Data Baru
  const openAddModal = () => {
    setEditingOrder(null);
    setClientName("");
    setWhatsappNumber("");
    setPackageFoundation("");
    setPackageInfrastructure("");
    setAdditionalFeatures("");
    setTotalPrice(0);
    setStatus("Pending");
    setIsModalOpen(true);
  };

  // Buka Modal Edit Data Lama
  const openEditModal = (order: OrderItem) => {
    setEditingOrder(order);
    setClientName(order.client_name);
    setWhatsappNumber(order.whatsapp_number);
    setPackageFoundation(order.package_foundation);
    setPackageInfrastructure(order.package_infrastructure);

    let featuresRaw = order.additional_features;

    if (typeof featuresRaw === "string") {
      try {
        const parsed = JSON.parse(featuresRaw);
        if (Array.isArray(parsed)) {
          featuresRaw = parsed;
        }
      } catch (e) {}
    }

    if (Array.isArray(featuresRaw)) {
      setAdditionalFeatures(featuresRaw.filter(Boolean).join(", "));
    } else if (typeof featuresRaw === "string") {
      const cleaned = featuresRaw.replace(/[\[\]"'\\]/g, "").trim();
      setAdditionalFeatures(cleaned);
    } else {
      setAdditionalFeatures("");
    }

    setTotalPrice(order.total_price);
    setStatus(order.status || "Pending");
    setIsModalOpen(true);
  };

  // Simpan Form (Tambah Baru / Update Data)
  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Ambil token di sini agar bisa dibaca oleh kode di dalam blok 'try'
    const token = localStorage.getItem("admin_token");

    const featuresArray = additionalFeatures
      ? additionalFeatures
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f !== "")
      : [];

    const payload = {
      client_name: clientName,
      whatsapp_number: whatsappNumber,
      package_foundation: packageFoundation,
      package_infrastructure: packageInfrastructure,
      additional_features: featuresArray,
      total_price: Number(totalPrice),
      status: status,
    };

    try {
      let res;
      if (editingOrder) {
        res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${editingOrder.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json", // <-- Ditambahkan agar Laravel membaca sebagai API
              Authorization: `Bearer ${token}`, // <-- Ditambahkan agar lolos Sanctum auth
            },
            body: JSON.stringify(payload),
          },
        );
      } else {
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json", // <-- Ditambahkan agar Laravel membaca sebagai API
            Authorization: `Bearer ${token}`, // <-- Ditambahkan agar lolos Sanctum auth
          },
          body: JSON.stringify(payload),
        });
      }

      const result = await res.json();
      if (result.success) {
        toast.success(result.message || "Data berhasil disimpan!");
        setIsModalOpen(false);
        fetchOrders();
      } else {
        toast.error("Gagal memproses data.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan sistem saat menyimpan data.");
    }
  };

  // Fungsi Hapus Pesanan (DELETE)
  // Fungsi Hapus Pesanan (DELETE)
  const handleDeleteOrder = async (id: number) => {
    toast("Konfirmasi Hapus Data", {
      description: "Seriusan data pesanan ini mau lu hapus, bro?",
      action: {
        label: "Hapus",
        onClick: async () => {
          // 1. AMBIL TOKEN DI SINI
          const token = localStorage.getItem("admin_token");

          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`,
              {
                method: "DELETE",
                // 2. TAMBAHKAN HEADERS DENGAN ACCEPT DAN AUTHORIZATION
                headers: {
                  Accept: "application/json",
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            const result = await res.json();
            if (result.success) {
              toast.success(result.message || "Pesanan berhasil dihapus!");
              fetchOrders();
            } else {
              toast.error("Gagal menghapus data.");
            }
          } catch (error) {
            console.error(error);
            toast.error("Gagal menghapus data akibat kesalahan sistem.");
          }
        },
      },
      cancel: {
        label: "Batal",
        onClick: () => {
          toast.dismiss();
        },
      },
      duration: 10000,
    });
  };

  // Fungsi Direct Chat WA
  const redirectToWhatsApp = (name: string, phone: string, total: number) => {
    let formattedPhone = phone.replace(/[^0-9]/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "62" + formattedPhone.slice(1);
    }
    const message = `Halo Kak ${name},\n\nTerima kasih telah mengunci slot proyek di CODEWEBS.\n\nEstimasi nilai investasi proyek Kakak tercatat sebesar *Rp ${total.toLocaleString("id-ID")}*.\n\nApakah ada waktu luang hari ini untuk mengobrol santai mengenai rincian fiturnya? 🙏✨`;
    window.open(
      `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  // Helper Informasi Keuangan untuk Laporan Riil DP 50%
  const getFinancialDetails = (statusString: string, totalPrice: number) => {
    const cleanStatus = statusString?.toLowerCase();
    if (cleanStatus === "completed") {
      return { paymentStatus: "Lunas (100%)", cashIn: totalPrice };
    } else if (cleanStatus === "in progress") {
      return { paymentStatus: "DP (50%)", cashIn: totalPrice * 0.5 };
    }
    return { paymentStatus: "Belum Bayar (0%)", cashIn: 0 };
  };

  // Helper Formatting Fitur Tambahan
  const renderTableFeatures = (features: string[] | string) => {
    if (!features) return "-";
    if (Array.isArray(features)) return features.join(", ");
    try {
      const parsed = JSON.parse(features);
      if (Array.isArray(parsed)) return parsed.join(", ");
    } catch (e) {}
    return (
      String(features)
        .replace(/[\[\]"'\\]/g, "")
        .trim() || "-"
    );
  };

  // ================= EXPORT EXCEL LOGIC =================
  const exportToExcel = () => {
    if (orders.length === 0) {
      toast.error("Data kosong, tidak ada yang bisa di-export, bro!");
      return;
    }

    const excelData = orders.map((o, index) => {
      const fin = getFinancialDetails(o.status, o.total_price);
      return {
        No: index + 1,
        "Nama Klien": o.client_name,
        "No. WhatsApp": o.whatsapp_number,
        "Paket Fondasi": o.package_foundation,
        Infrastruktur: o.package_infrastructure,
        "Fitur Tambahan": renderTableFeatures(o.additional_features),
        "Total Nilai Kontrak": o.total_price,
        "Status Proyek": o.status || "Pending",
        "Status Pembayaran": fin.paymentStatus,
        "Uang Masuk (Riil)": fin.cashIn,
        "Tanggal Masuk": new Date(o.created_at).toLocaleDateString("id-ID"),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Pesanan");

    worksheet["!cols"] = [
      { wch: 5 },
      { wch: 20 },
      { wch: 15 },
      { wch: 18 },
      { wch: 20 },
      { wch: 30 },
      { wch: 18 },
      { wch: 15 },
      { wch: 18 },
      { wch: 18 },
      { wch: 15 },
    ];

    XLSX.writeFile(
      workbook,
      `Laporan_Order_CODEWEBS_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
    toast.success("Laporan Excel berhasil di-download!");
  };

  // ================= EXPORT PDF (MURNI SAMA DENGAN EXCEL) LOGIC =================
  const generatePDFReport = () => {
    if (orders.length === 0) {
      toast.error("Data kosong, tidak ada yang bisa diexport ke PDF!");
      return;
    }

    // 1. Inisialisasi jsPDF dengan format Landscape A4 agar muat banyak kolom
    const doc = new jsPDF({ orientation: "landscape", format: "a4" });

    // 2. Tambah Judul Dokumen (Header)
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("CODEWEBS AGENCY MASTER REPORT", 14, 18);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Tanggal Export Laporan: ${new Date().toLocaleDateString("id-ID")} | Format Sinkron Excel`,
      14,
      24,
    );

    // Hitung ringkasan kas untuk ditaruh di PDF header
    const pendingCount = orders.filter(
      (o) => o.status?.toLowerCase() === "pending",
    ).length;
    const totalCashIn = orders.reduce(
      (sum, o) => sum + getFinancialDetails(o.status, o.total_price).cashIn,
      0,
    );

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(
      `Total Leads: ${orders.length}  |  Pending Follow-up: ${pendingCount} Klien  |  Total Uang Masuk Bersih: Rp ${totalCashIn.toLocaleString("id-ID")}`,
      14,
      32,
    );

    // 3. Susun Kolom Header (Persis Urutan Data Excel)
    const tableColumn = [
      "No",
      "Nama Klien",
      "No. WhatsApp",
      "Paket Fondasi",
      "Infrastruktur",
      "Fitur Tambahan",
      "Total Nilai Kontrak",
      "Status Proyek",
      "Status Pembayaran",
      "Uang Masuk (Riil)",
      "Tanggal Masuk",
    ];

    // 4. Susun Row Baris Data (Persis Logika Excel)
    const tableRows = orders.map((o, index) => {
      const fin = getFinancialDetails(o.status, o.total_price);
      return [
        index + 1,
        o.client_name,
        o.whatsapp_number,
        o.package_foundation,
        o.package_infrastructure,
        renderTableFeatures(o.additional_features),
        `Rp ${o.total_price.toLocaleString("id-ID")}`,
        o.status || "Pending",
        fin.paymentStatus,
        `Rp ${fin.cashIn.toLocaleString("id-ID")}`,
        new Date(o.created_at).toLocaleDateString("id-ID"),
      ];
    });

    // 5. Render Tabel Bergaris Profesional ke dalam Dokumen PDF
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 38,
      theme: "grid", // Grid bergaris rapi menyerupai Excel spreadsheet
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: "linebreak",
        font: "Helvetica",
      },
      headStyles: {
        fillColor: [30, 41, 59], // Warna Slate Gelap yang elegan untuk Header tabel
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 12 }, // No
        6: { fontStyle: "bold" }, // Total Nilai Kontrak
        9: { fontStyle: "bold" }, // Uang Masuk
      },
      didParseCell: function (data) {
        // Beri highlight warna teks dinamis sesuai status pembayaran di PDF
        if (data.section === "body" && data.column.index === 8) {
          const text = String(data.cell.raw);
          if (text.includes("Lunas"))
            data.cell.styles.textColor = [16, 185, 129]; // Emerald Green
          if (text.includes("DP")) data.cell.styles.textColor = [37, 99, 235]; // Blue
          if (text.includes("Belum"))
            data.cell.styles.textColor = [245, 158, 11]; // Amber
        }
      },
    });

    // 6. Triger Otomatis Unduhan File PDF Klien
    doc.save(
      `Laporan_Order_CODEWEBS_${new Date().toISOString().slice(0, 10)}.pdf`,
    );
    toast.success("Laporan PDF Premium berhasil di-download!");
  };

  // --- STATS CARDS CALCULATIONS (UNTUK TAMPILAN DASHBOARD LAYAR) ---
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.status?.toLowerCase() === "pending",
  ).length;
  const totalRevenueEstimation = orders.reduce(
    (sum, o) => sum + getFinancialDetails(o.status, o.total_price).cashIn,
    0,
  );

  const getStatusBadgeClass = (statusString: string) => {
    const cleanStatus = statusString?.toLowerCase();
    if (cleanStatus === "pending") return "bg-amber-100 text-amber-700";
    if (cleanStatus === "in progress") return "bg-blue-100 text-blue-700";
    if (cleanStatus === "completed") return "bg-emerald-100 text-emerald-700";
    return "bg-slate-100 text-slate-700";
  };

  if (loading) {
    return (
      <div className="text-center font-bold p-12 text-slate-900">
        Memuat Daftar Pesanan Masuk...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
            Incoming Orders
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Pantau leads masuk, kelola dana DP proyek, dan unduh laporan agensi
            terpusat.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={exportToExcel}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs tracking-wider uppercase px-4 py-3 rounded-xl transition-all inline-flex items-center gap-2 shadow-sm"
          >
            <i className="fa-solid fa-file-excel text-xs"></i> Export Excel
          </button>
          <button
            onClick={generatePDFReport}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs tracking-wider uppercase px-4 py-3 rounded-xl transition-all inline-flex items-center gap-2 shadow-sm"
          >
            <i className="fa-solid fa-file-pdf text-xs"></i> Cetak PDF
          </button>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wider uppercase px-4 py-3 rounded-xl transition-all shadow-md shadow-blue-600/10 inline-flex items-center gap-2"
          >
            <i className="fa-solid fa-plus text-xs"></i> Tambah Manual
          </button>
        </div>
      </div>

      {/* STATS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
            Total Leads Masuk
          </p>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {totalOrders} Pesanan
          </p>
        </div>
        <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-black uppercase text-amber-500 tracking-widest">
            Perlu Dihubungi (Pending)
          </p>
          <p className="text-3xl font-black text-amber-600 mt-2">
            {pendingOrders} Klien
          </p>
        </div>
        <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest">
            Total Uang Masuk Bersih (Omzet Riil)
          </p>
          <p className="text-3xl font-black text-blue-700 mt-2">
            Rp {totalRevenueEstimation.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* ORDERS TABLE SECTION ON DASHBOARD SCREEN */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-slate-800 uppercase tracking-wider">
          Daftar Antrean Proyek & Alur Kas
        </h3>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center w-12">
                    No
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Nama Klien
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    No. WhatsApp
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Paket Fondasi
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Infrastruktur
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Fitur Tambahan
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Total Kontrak
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">
                    Proyek
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Pembayaran
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Uang Masuk
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Tanggal
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={12}
                      className="px-6 py-10 text-center text-sm font-medium text-slate-400"
                    >
                      Belum ada pesanan masuk.
                    </td>
                  </tr>
                ) : (
                  orders.map((order, index) => {
                    const fin = getFinancialDetails(
                      order.status,
                      order.total_price,
                    );
                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-4 py-3 text-center text-sm font-medium text-slate-600">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-900">
                          {order.client_name}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600 font-medium">
                          {order.whatsapp_number}
                        </td>
                        <td className="px-4 py-3 text-xs font-bold text-slate-700">
                          {order.package_foundation}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 font-medium">
                          {order.package_infrastructure}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 max-w-[150px] truncate font-medium">
                          {renderTableFeatures(order.additional_features)}
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-700 text-xs">
                          Rp {order.total_price.toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${getStatusBadgeClass(order.status || "Pending")}`}
                          >
                            {order.status || "Pending"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs font-bold">
                          <span
                            className={
                              fin.paymentStatus.includes("Lunas")
                                ? "text-emerald-600"
                                : fin.paymentStatus.includes("DP")
                                  ? "text-blue-600"
                                  : "text-amber-600"
                            }
                          >
                            {fin.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-black text-slate-900 text-xs">
                          Rp {fin.cashIn.toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 font-medium">
                          {new Date(order.created_at).toLocaleDateString(
                            "id-ID",
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() =>
                                redirectToWhatsApp(
                                  order.client_name,
                                  order.whatsapp_number,
                                  order.total_price,
                                )
                              }
                              className="bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded-lg transition-colors"
                            >
                              <i className="fa-brands fa-whatsapp text-xs block w-3.5 h-3.5 flex items-center justify-center"></i>
                            </button>
                            <button
                              onClick={() => openEditModal(order)}
                              className="bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white p-1.5 rounded-lg transition-colors"
                            >
                              <i className="fa-solid fa-pen-to-square text-xs block w-3.5 h-3.5 flex items-center justify-center"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="bg-slate-100 hover:bg-rose-600 text-slate-400 hover:text-white p-1.5 rounded-lg transition-colors"
                            >
                              <i className="fa-solid fa-trash-can text-xs block w-3.5 h-3.5 flex items-center justify-center"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL DIALOG POP-UP UNTUK CRUD INPUT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-100 p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {editingOrder
                  ? "Edit Rincian Pesanan"
                  : "Tambah Pesanan Manual"}
              </h3>
            </div>

            <form onSubmit={handleSaveOrder} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-800 tracking-wider">
                    Nama Klien
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-sm"
                    placeholder="Nama Calon Klien"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-800 tracking-wider">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="text"
                    required
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-sm"
                    placeholder="Contoh: 0812345678"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-800 tracking-wider">
                    Tipe Fondasi
                  </label>
                  <input
                    type="text"
                    required
                    value={packageFoundation}
                    onChange={(e) => setPackageFoundation(e.target.value)}
                    className="border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-sm"
                    placeholder="E-Commerce / Landing Page"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-800 tracking-wider">
                    Infrastruktur
                  </label>
                  <input
                    type="text"
                    required
                    value={packageInfrastructure}
                    onChange={(e) => setPackageInfrastructure(e.target.value)}
                    className="border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-sm"
                    placeholder="Standard Hosting / Premium VPS"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-800 tracking-wider">
                  Fitur Tambahan (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={additionalFeatures}
                  onChange={(e) => setAdditionalFeatures(e.target.value)}
                  className="border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-sm"
                  placeholder="Contoh: SEO, Live Chat"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-800 tracking-wider">
                    Total Nilai Investasi (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={totalPrice}
                    onChange={(e) => setTotalPrice(Number(e.target.value))}
                    className="border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-sm font-bold text-blue-600"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    Status Proyek
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 bg-white"
                  >
                    <option value="Pending">Pending (Belum Di-followup)</option>
                    <option value="In Progress">In Progress (DP 50%)</option>
                    <option value="Completed">
                      Completed (Lunas / Selesai)
                    </option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
