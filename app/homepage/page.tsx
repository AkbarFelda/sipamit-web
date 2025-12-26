"use client";

import MenuCard from "@/presentation/components/HomePage/MenuCard";
import MobileContainer from "@/presentation/components/MobileContainer";
import { useGreeting } from "@/presentation/hooks/useGreeting";
import { User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const greeting = useGreeting();
  const user = "Akmal Reza";
  const router = useRouter();
  const handleLogout = () => {
    router.push("/");
  };
  return (
    <MobileContainer className="bg-linear-to-b from-blue-top to-blue-bottom p-6">
      <div className="flex justify-between items-start mb-8 text-black">
        <div>
          <p className="text-lg font-medium">{greeting},</p>
          <h1 className="text-2xl font-bold">{user} 👋</h1>
        </div>
        <button
          className="p-2 hover:bg-white/20 rounded-full transition-all"
          onClick={handleLogout}
        >
          <LogOut size={24} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <MenuCard
          icon={User}
          label={"SPK Pasang Baru"}
          onClick={() => router.push(`/spk/spk-pasang-baru`)}
        ></MenuCard>
        <MenuCard icon={User} label={"SPK Pelayanan Lain"}></MenuCard>
        <MenuCard icon={User} label={"SPK Pengaduan"}></MenuCard>
        <MenuCard icon={User} label={"SPK Penyegelan Pelanggan"}></MenuCard>
        <MenuCard icon={User} label={"SPK Pergantian Meter"}></MenuCard>
        <MenuCard icon={User} label={"SPK Pemutusan Tagihan"}></MenuCard>
      </div>
    </MobileContainer>
  );
}
