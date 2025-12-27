"use client";

import MobileContainer from "@/presentation/components/MobileContainer";
import HeaderPage from "@/presentation/components/HeaderPage";
import {  Mail, Phone, Building2, ShieldCheck, ChevronRight, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const userProfile = {
    nama: "Akmal Reza",
    nip: "19940312 202101 1 002",
    jabatan: "Teknisi Lapangan Utama",
    unit: "Cabang Sleman Timur",
    email: "akmal.reza@pdam-sleman.co.id",
    noHp: "0812-3456-7890",
  };

  return (
    <MobileContainer className="bg-gray-50 flex flex-col pb-10">
      <HeaderPage title="Profil Saya" />

      <div className="p-6">
        {/* Card Foto Profil & Identitas Utama */}
        <div className="bg-white rounded-4xl p-8 shadow-sm border border-gray-100 flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-blue-600 rounded-full border-4 border-blue-50 shadow-lg flex items-center justify-center text-white text-3xl font-bold mb-4">
            AR
          </div>
          <h2 className="text-xl font-bold text-gray-800">{userProfile.nama}</h2>
          <p className="text-sm text-blue-600 font-semibold mb-1">{userProfile.jabatan}</p>
          <p className="text-xs text-gray-400">NIP: {userProfile.nip}</p>
        </div>

        {/* Card Detail Informasi */}
        <div className="bg-white rounded-4xl p-6 shadow-sm border border-gray-100 space-y-5 mb-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Informasi Kerja</h3>
          
          <div className="flex items-center gap-4">
            <div className="bg-gray-50 p-2.5 rounded-xl text-gray-500">
              <Building2 size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Unit Kerja</p>
              <p className="text-sm font-medium text-gray-700">{userProfile.unit}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-gray-50 p-2.5 rounded-xl text-gray-500">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Email Kedinasan</p>
              <p className="text-sm font-medium text-gray-700">{userProfile.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-gray-50 p-2.5 rounded-xl text-gray-500">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Nomor WhatsApp</p>
              <p className="text-sm font-medium text-gray-700">{userProfile.noHp}</p>
            </div>
          </div>
        </div>

        {/* Menu Aksi Lainnya */}
        <div className="space-y-3">
          <button 
            onClick={() => router.push("/change-password")}
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg text-green-600">
                <ShieldCheck size={20} />
              </div>
              <span className="text-sm font-bold text-gray-700">Keamanan Akun</span>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </button>

          <button 
            onClick={() => router.push("/")}
            className="w-full flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100 active:scale-95 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-red-500 p-2 rounded-lg text-white">
                <LogOut size={20} />
              </div>
              <span className="text-sm font-bold text-red-600">Keluar Aplikasi</span>
            </div>
          </button>
        </div>

        {/* Versi Aplikasi */}
        <p className="text-center text-[10px] text-gray-300 mt-8 font-medium">
          SIPAMIT Mobile Version 1.0.0 (Stable)
        </p>
      </div>
    </MobileContainer>
  );
}