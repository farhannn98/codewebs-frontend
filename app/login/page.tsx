"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // 1. PASTIKAN STATE INI ADA DI SINI
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
      });
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json", // Tambahkan ini agar backend tahu kamu minta JSON
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // INI KUNCINYA agar cookie sesi terkirim
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        router.push("/admin");
      } else {
        alert("Akses ditolak. Detail autentikasi salah.");
      }
    } catch (error) {
      console.error("Error saat login:", error);
      alert("Gagal terhubung ke secure server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-slate-100 antialiased">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-1/3 w-[500px] h-[500px] rounded-full bg-blue-900/10 blur-[150px]" />
      </div>

      <div className="w-full max-w-md p-8 md:p-10 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white tracking-tighter">
            CODE<span className="text-blue-500">WEBS.</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.25em] mt-2">
            Agency Management Login
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              Email Address
            </label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@codewebs.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                  showPassword
                    ? "text-red-500 hover:text-red-400"
                    : "text-slate-600 hover:text-slate-400"
                }`}
              >
                <i
                  className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm transition-all duration-300 tracking-widest uppercase mt-4 shadow-lg shadow-blue-900/20 disabled:bg-slate-700"
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full text-slate-500 hover:text-slate-300 py-3 text-xs font-bold transition-all duration-300 tracking-widest uppercase underline underline-offset-4"
          >
            Batal
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-slate-800">
          <p className="text-[9px] tracking-widest text-slate-600 font-bold uppercase">
            &copy; {new Date().getFullYear()} CodeWebs. Secure Access.
          </p>
        </div>
      </div>
    </div>
  );
}
