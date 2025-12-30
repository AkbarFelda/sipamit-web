"use client";

import MenuCard from "@/presentation/components/HomePage/MenuCard";
import MobileContainer from "@/presentation/components/MobileContainer";
import { useGreeting } from "@/presentation/hooks/useGreeting";
import { User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useState } from "react";
import Cookies from "js-cookie";

export default function HomePage() {
  const router = useRouter();
  const greeting = useGreeting();
  const { logout } = useAuth();

  const [userName] = useState(() => {
    const savedName = Cookies.get("user_name");
    return savedName || "User";
  });

  const getInitial = (name: string) => {
    if (!name) return "";
    const parts = name.split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const stats = {
    pasangBaru: 3,
    pelayananLain: 5,
    pengaduan: 8,
    penyegelan: 3,
    pergantianMeter: 10,
    pemutusan: 4,
  };

  return (
    <MobileContainer className="bg-linear-to-b from-blue-top to-blue-bottom p-6 flex flex-col min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/profile")}
            className="w-12 h-12 bg-blue-600 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white overflow-hidden active:scale-90 transition-transform"
          >
            <span className="font-bold text-lg">{getInitial(userName)}</span>
          </button>
          <div>
            <p className="text-xs text-gray-600 font-medium">{greeting},</p>
            <h1 className="text-lg font-bold text-black capitalize">
              {userName}
            </h1>
          </div>
        </div>
        <button
          className="p-2.5 bg-white/50 hover:bg-white/80 rounded-full transition-all shadow-sm border border-white/20"
          onClick={logout}
        >
          <LogOut size={20} className="text-red-500" />
        </button>
      </div>

      <div className="bg-white/30 backdrop-blur-md p-4 rounded-2xl mb-8 border border-white/20">
        <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
          Informasi
        </p>
        <h2 className="text-sm font-semibold text-gray-800 leading-relaxed">
          Selamat Datang di Aplikasi Teknik SIPAMIT. Silahkan pilih tugas Anda
          hari ini.
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-10">
        <MenuCard
          icon={User}
          label={"SPK Pasang Baru"}
          count={stats.pasangBaru}
          onClick={() => router.push(`/spk/pasang-baru`)}
        />
        <MenuCard
          icon={User}
          label={"SPK Pelayanan Lain"}
          count={stats.pelayananLain}
          onClick={() => router.push(`/spk/pelayanan-lain`)}
        />
        <MenuCard
          icon={User}
          label={"SPK Pengaduan"}
          count={stats.pengaduan}
          onClick={() => router.push(`/spk/pengaduan`)}
        />
        <MenuCard
          icon={User}
          label={"SPK Penyegelan"}
          count={stats.penyegelan}
          onClick={() => router.push(`/spk/penyegelan`)}
        />
        <MenuCard
          icon={User}
          label={"SPK Pergantian Meter"}
          count={stats.pergantianMeter}
          onClick={() => {}} 
          disabled={true}
          badge="Akan Hadir" 
        />
        <MenuCard
          icon={User}
          label={"SPK Pemutusan"}
          count={stats.pemutusan}
          onClick={() => {}}
          disabled={true}
          badge="Akan Hadir"
        />
      </div>
    </MobileContainer>
  );
}
