"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { User, LogOut, Lock, Unlock, X } from "lucide-react";

import MenuCard from "@/presentation/components/HomePage/MenuCard";
import MobileContainer from "@/presentation/components/MobileContainer";
import LoadingOverlay from "@/presentation/components/LoadingOverlay"; // Import LoadingOverlay
import { useGreeting } from "@/presentation/hooks/useGreeting";
import { useAuth } from "@/presentation/hooks/useAuth";
import { spkService } from "@/core/services/spkService";

export default function HomePage() {
  const router = useRouter();
  const greeting = useGreeting();
  const { logout } = useAuth();
  
  const [isSealingModalOpen, setIsSealingModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State loading awal true
  const token = Cookies.get("user_token") || "";
  
  const [stats, setStats] = useState({
    pasangBaru: 0,
    pelayananLain: 0,
    pengaduan: 0,
    penyegelan: 0,
  });

  const [userName] = useState(() => {
    const savedName = Cookies.get("user_name");
    return savedName || "Teknisi";
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true); // Pastikan loading aktif saat mulai fetch
        const [psb, aduan, nonAir, segel] = await Promise.all([
          spkService.getList("pasang-baru", 0, token),
          spkService.getList("pengaduan", 0, token),
          spkService.getList("pelayanan-lain", 0, token),
          spkService.getList("penyegelan", 0, token),
        ]);

        setStats({
          pasangBaru: Array.isArray(psb) ? psb.length : 0,
          pengaduan: Array.isArray(aduan) ? aduan.length : 0,
          pelayananLain: Array.isArray(nonAir) ? nonAir.length : 0,
          penyegelan: Array.isArray(segel) ? segel.length : 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false); // Matikan loading setelah selesai (berhasil/gagal)
      }
    };

    fetchStats();
  }, [token]);

  const getInitial = (name: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
  };

  return (
    <MobileContainer className="bg-linear-to-b from-blue-50 to-white p-6 flex flex-col min-h-screen relative text-black">
      
      {/* Tampilkan Loading Overlay jika isLoading true */}
      {isLoading && <LoadingOverlay message="Mohon menunggu" />}

      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/profile")}
            className="w-14 h-14 bg-blue-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white overflow-hidden active:scale-90 transition-transform"
          >
            <span className="font-black text-xl">{getInitial(userName)}</span>
          </button>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter">
              {greeting},
            </p>
            <h1 className="text-xl font-black text-gray-900 capitalize leading-tight">
              {userName}
            </h1>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="p-3 bg-white/50 hover:bg-red-100 rounded-full transition-all shadow-sm border border-red-100"
            onClick={logout}
          >
            <LogOut size={20} className="text-red-500" />
          </button>
        </div>
      </div>

      {/* INFO CARD */}
      <div className="bg-white/30 backdrop-blur-md p-4 rounded-2xl mb-8 border border-white/20">
        <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
          Informasi
        </p>
        <h2 className="text-sm font-semibold text-gray-800 leading-relaxed">
          Selamat Datang di Aplikasi Teknik SIPAMIT. Silahkan pilih tugas Anda
          hari ini.
        </h2>
      </div>

      {/* MENU GRID */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <MenuCard
          icon={User}
          label={"SPK Pasang Baru"}
          count={stats.pasangBaru}
          onClick={() => router.push(`/spk/pasang-baru`)}
          disabled={isLoading}
        />
        <MenuCard
          icon={User}
          label={"SPK Pelayanan Lain"}
          count={stats.pelayananLain}
          onClick={() => router.push(`/spk/pelayanan-lain`)}
          disabled={isLoading}
        />
        <MenuCard
          icon={User}
          label={"SPK Pengaduan"}
          count={stats.pengaduan}
          onClick={() => router.push(`/spk/pengaduan`)}
          disabled={isLoading}
        />
        <MenuCard
          icon={User}
          label={"SPK Penyegelan"}
          count={stats.penyegelan}
          onClick={() => setIsSealingModalOpen(true)}
          disabled={isLoading}
        />
        <MenuCard
          icon={User}
          label={"SPK Ganti Meter"}
          disabled={true}
          badge="Akan Hadir"
        />
        <MenuCard
          icon={User}
          label={"SPK Pemutusan"}
          disabled={true}
          badge="Akan Hadir"
        />
      </div>

      {/* MODAL PENYEGELAN */}
      {isSealingModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center transition-all duration-300"
          onClick={() => setIsSealingModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-t-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />

            <div className="text-center mb-8">
              <h3 className="text-xl font-black text-gray-800 mb-2">
                Jenis Operasional
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                Silahkan pilih jenis tugas penyegelan
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => router.push("/spk/penyegelan")}
                className="flex flex-col items-center justify-center p-6 bg-orange-50 rounded-4xl border border-orange-100 active:scale-95 transition-all group"
              >
                <div className="bg-orange-500 text-white p-4 rounded-2xl mb-4 shadow-lg shadow-orange-200 group-hover:rotate-12 transition-transform">
                  <Lock size={28} />
                </div>
                <span className="text-sm font-black text-orange-900">
                  Penyegelan
                </span>
              </button>
              <button
                onClick={() => router.push("/spk/buka-segel")}
                className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-4xl border border-green-100 active:scale-95 transition-all group"
              >
                <div className="bg-green-500 text-white p-4 rounded-2xl mb-4 shadow-lg shadow-green-200 group-hover:-rotate-12 transition-transform">
                  <Unlock size={28} />
                </div>
                <span className="text-sm font-black text-green-900">
                  Buka Segel
                </span>
              </button>
            </div>

            <button
              onClick={() => setIsSealingModalOpen(false)}
              className="w-full mt-8 py-4 bg-gray-100 text-black font-extrabold rounded-2xl active:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <X size={18} /> TUTUP
            </button>
          </div>
        </div>
      )}
    </MobileContainer>
  );
}