"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "sonner";
import Image from "next/image";

// Komponen NavItem yang sudah dimodifikasi agar rapi dan seragam
function NavItem({
  href,
  icon,
  label,
  active,
  onClick,
}: {
  href?: string;
  icon: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  // Isi konten yang sama untuk link maupun button
  const content = (
    <div
      className={`group flex items-center gap-4 px-5 py-3.5 transition-all duration-300 rounded-2xl ${
        active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
      }`}
    >
      <div className="w-6 flex justify-center items-center">
        <i
          className={`${icon} ${active ? "text-white" : "text-slate-500 group-hover:text-blue-400"} text-sm transition-colors`}
        ></i>
      </div>
      <span className="font-bold text-[13px] tracking-widest uppercase">
        {label}
      </span>
    </div>
  );

  // Jika ada onClick, render sebagai button, jika tidak render sebagai link
  return onClick ? (
    <button onClick={onClick} className="w-full text-left">
      {content}
    </button>
  ) : (
    <Link href={href!}>{content}</Link>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    if (!confirm("Yakin ingin keluar?")) return;
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">
      <Toaster />
      <aside className="w-72 bg-slate-950 p-6 flex flex-col fixed h-screen z-50">
        <div className="px-4 py-8 mb-6 flex items-center gap-3">
          {/* Container Logo */}
          <div className="h-10 w-10 relative">
            <Image
              src="/assets/logoCDwhite.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>

          {/* Container Teks */}
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter">
              CODE<span className="text-blue-500">WEBS.</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.25em] mt-0.5">
              Agency Management
            </p>
          </div>
        </div>

        {/* List menu utama */}
        <nav className="flex-1 space-y-2">
          <NavItem
            href="/admin"
            icon="fa-solid fa-gauge"
            label="Dashboard"
            active={pathname === "/admin"}
          />
          <NavItem
            href="/admin/portofolio"
            icon="fa-solid fa-layer-group"
            label="Portfolio"
            active={pathname.includes("/portofolio")}
          />
          <NavItem
            href="/admin/orders"
            icon="fa-solid fa-paper-plane"
            label="Orders"
            active={pathname.includes("/orders")}
          />
          <NavItem
            href="/admin/pricing"
            icon="fa-solid fa-tags"
            label="Pricing"
            active={pathname.includes("/pricing")}
          />

          {/* Pemisah untuk Logout */}
          <div className="pt-6 mt-6 border-t border-slate-800">
            <NavItem
              icon="fa-solid fa-right-from-bracket"
              label="Log Out"
              onClick={handleLogout}
              active={false}
            />
          </div>
        </nav>
      </aside>

      <main className="flex-1 ml-72">
        <header className="h-20 border-b border-slate-100 flex items-center justify-end px-12 bg-white/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900">Admin</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">
                System Operator
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
              CW
            </div>
          </div>
        </header>
        <div className="p-12">{children}</div>
      </main>
    </div>
  );
}
