"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeaderPage({ title }: { title: string }) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-4 p-6 text-black">
      <button 
        onClick={() => router.back()} 
        className="p-2 bg-white/20 rounded-xl hover:bg-white/40 transition-all"
      >
        <ChevronLeft size={24} />
      </button>
      <h1 className="text-xl font-bold">{title}</h1>
    </div>
  );
}