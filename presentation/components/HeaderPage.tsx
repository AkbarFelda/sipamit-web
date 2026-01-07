"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderPageProps {
  title: string;
  fallbackPath?: string; 
}

export default function HeaderPage({ title, fallbackPath }: HeaderPageProps) {
  const router = useRouter();

  const handleBack = () => {
    if (fallbackPath) {
      router.push(fallbackPath);
    } else {
      router.back();
    }
  };

  return (
    <div className="flex items-center gap-4 p-6 text-black bg-white/50 backdrop-blur-md sticky top-0 z-50">
      <button 
        onClick={handleBack} 
        className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 active:scale-90 transition-all"
      >
        <ChevronLeft size={24} />
      </button>
      <h1 className="text-xl font-black">{title}</h1>
    </div>
  );
}