"use client";

import React, { useState, useEffect } from "react";

interface PackageItem {
  id: number;
  type: "foundation" | "infrastructure" | "addon";
  name: string;
  price: number;
}

export default function CalculatorOrderSection() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);

  // State Pilihan Klien (Data Checkout)
  const [clientName, setClientName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [selectedFoundation, setSelectedFoundation] =
    useState<PackageItem | null>(null);
  const [selectedInfrastructure, setSelectedInfrastructure] =
    useState<PackageItem | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<PackageItem[]>([]);

  // 1. Ambil data paket yang aktif dari Laravel
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/service-packages`,
        );
        const result = await res.json();
        if (result.success) {
          setPackages(result.data);

          // Set default pilihan pertama agar tidak kosong
          const foundations = result.data.filter(
            (p: PackageItem) => p.type === "foundation",
          );
          const infrastructures = result.data.filter(
            (p: PackageItem) => p.type === "infrastructure",
          );
          if (foundations.length > 0) setSelectedFoundation(foundations[0]);
          if (infrastructures.length > 0)
            setSelectedInfrastructure(infrastructures[0]);
        }
      } catch (error) {
        console.error("Gagal memuat paket kalkulator:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Handle klik on/off untuk Fitur Tambahan (Checkbox System)
  const handleAddonToggle = (addon: PackageItem) => {
    if (selectedAddons.some((item) => item.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((item) => item.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  // 3. Hitung Total Estimasi Investasi secara Otomatis
  const calculateTotal = () => {
    const base = selectedFoundation ? selectedFoundation.price : 0;
    const infra = selectedInfrastructure ? selectedInfrastructure.price : 0;
    const addonsTotal = selectedAddons.reduce(
      (sum, item) => sum + item.price,
      0,
    );
    return base + infra + addonsTotal;
  };

  // 4. Kirim Data Pesanan ke API Laravel + Direct Ke WhatsApp Owner CODEWEBS
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName || !whatsappNumber) {
      alert("Isi nama dan nomor WhatsApp lu dulu, bro!");
      return;
    }

    if (!selectedFoundation || !selectedInfrastructure) {
      alert("Pilih fondasi dan infrastruktur website terlebih dahulu.");
      return;
    }

    const totalEstimate = calculateTotal();
    const addonsList = selectedAddons.map((addon) => addon.name);

    const payload = {
      client_name: clientName,
      whatsapp_number: whatsappNumber,
      package_foundation: selectedFoundation.name,
      package_infrastructure: selectedInfrastructure.name,
      additional_features: addonsList,
      total_price: totalEstimate,
    };

    try {
      // TAHAP 1: Amankan data leads masuk ke database admin via Laravel
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        // TAHAP 2: Buka otomatis WhatsApp ke nomor Owner (Lu) bawa rincian pesanan
        // Silakan ganti nomor di bawah ini dengan nomor WA lu (Gunakan kode negara 62 di depan)
        const ownerWhatsAppNumber = "6281228372220";

        const messageToOwner = `Halo CODEWEBS! ✨\n\nSaya *${clientName}* baru saja melakukan kalkulasi harga di website dan ingin mengunci slot proyek.\n\nBerikut adalah rincian kebutuhan saya:\n- *Tipe Proyek:* ${selectedFoundation.name}\n- *Infrastruktur:* ${selectedInfrastructure.name}\n- *Fitur Tambahan:* ${addonsList.length > 0 ? addonsList.join(", ") : "Tidak ada"}\n\n*Total Estimasi Investasi:* Rp ${totalEstimate.toLocaleString("id-ID")}\n\nMohon rincian ini segera diproses dan dikonfirmasi ya, terima kasih! 🙏`;

        const encodedMessage = encodeURIComponent(messageToOwner);

        // redirect instant ke tab baru
        window.open(
          `https://api.whatsapp.com/send?phone=${ownerWhatsAppNumber}&text=${encodedMessage}`,
          "_blank",
        );

        // Reset input form agar bersih kembali
        setClientName("");
        setWhatsappNumber("");
        setSelectedAddons([]);
      } else {
        alert("Gagal memajukan pesanan, silahkan coba lagi, bro.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem saat memproses pesanan.");
    }
  };

  if (loading)
    return (
      <div className="text-center p-20 font-bold">
        Memuat Kalkulator Harga Premium...
      </div>
    );

  return (
    <section
      id="order"
      className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      {/* KIRI: FORM PILIHAN OPSIONAL (2 Kolom di Desktop) */}
      <div className="lg:col-span-2 space-y-10">
        {/* INPUT IDENTITAS KLIEN */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            Informasi Kontak Anda
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nama Lengkap / Nama Bisnis"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-blue-500 font-medium"
            />
            <input
              type="text"
              placeholder="Nomor WhatsApp (Contoh: 08123xxx)"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-blue-500 font-medium"
            />
          </div>
        </div>

        {/* 1. TIPE FONDASI */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            1. Pilih Tipe Fondasi Website
          </h4>
          <div className="space-y-2">
            {packages
              .filter((p) => p.type === "foundation")
              .map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedFoundation(item)}
                  className={`flex justify-between items-center p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedFoundation?.id === item.id
                      ? "border-blue-600 bg-blue-50/20 shadow-sm"
                      : "border-slate-100 bg-white hover:border-slate-300"
                  }`}
                >
                  <span className="font-bold text-slate-900">{item.name}</span>
                  <span className="font-black text-slate-900">
                    Rp {item.price.toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* 2. PAKET INFRASTRUKTUR */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            2. Pilih Paket Infrastruktur
          </h4>
          <div className="space-y-2">
            {packages
              .filter((p) => p.type === "infrastructure")
              .map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedInfrastructure(item)}
                  className={`flex justify-between items-center p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedInfrastructure?.id === item.id
                      ? "border-blue-600 bg-blue-50/20 shadow-sm"
                      : "border-slate-100 bg-white hover:border-slate-300"
                  }`}
                >
                  <span className="font-bold text-slate-900">{item.name}</span>
                  <span className="font-black text-slate-400">
                    + Rp {item.price.toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* 3. FITUR TAMBAHAN */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            3. Fitur Tambahan
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {packages
              .filter((p) => p.type === "addon")
              .map((item) => {
                const isSelected = selectedAddons.some(
                  (addon) => addon.id === item.id,
                );
                return (
                  <div
                    key={item.id}
                    onClick={() => handleAddonToggle(item)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1 ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/20"
                        : "border-slate-100 bg-white hover:border-slate-300"
                    }`}
                  >
                    <p className="font-bold text-slate-900 text-sm">
                      {item.name}
                    </p>
                    <p className="font-bold text-slate-400 text-xs">
                      + Rp {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* KANAN: FLOATING BOX TOTAL ESTIMASI INVESTASI */}
      <div className="lg:col-span-1">
        <div className="bg-[#0f172a] text-white p-6 rounded-3xl shadow-xl space-y-6 sticky top-28">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Estimasi Investasi
            </p>
            <h2 className="text-4xl font-black tracking-tight mt-1 text-blue-400">
              Rp {calculateTotal().toLocaleString("id-ID")}
            </h2>
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-2 text-xs font-medium text-slate-300">
            <div className="flex justify-between">
              <span>Tipe Proyek:</span>
              <span className="font-bold text-white">
                {selectedFoundation?.name || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Infrastruktur:</span>
              <span className="font-bold text-white">
                {selectedInfrastructure?.name || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Fitur Tambahan:</span>
              <span className="font-bold text-white">
                {selectedAddons.length} Dipilih
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-blue-600 text-white font-black text-xs py-4 rounded-xl hover:bg-blue-700 transition-all uppercase tracking-widest shadow-md shadow-blue-600/20"
          >
            KUNCI SLOT PROYEK SEKARANG
          </button>
        </div>
      </div>
    </section>
  );
}
