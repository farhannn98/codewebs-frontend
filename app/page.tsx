"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portofolio";
import Order from "@/components/Order";
import Workflow from "@/components/Workflow";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans antialiased text-slate-800 selection:bg-blue-600 selection:text-white">
      <Navbar />
      <Hero />
      <Portfolio />
      <Order />
      <Workflow />
      <FAQ />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
