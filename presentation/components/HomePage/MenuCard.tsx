"use client";

import { LucideIcon } from "lucide-react";

interface MenuCardProps {
  icon: LucideIcon;
  label: string;
  count?: number;
  onClick?: () => void;
  disabled?: boolean; // Tambahkan logika disabled
  badge?: string;    // Tambahkan prop badge
}

export default function MenuCard({
  icon: Icon,
  label,
  count,
  onClick,
  disabled,
  badge
}: MenuCardProps) {
  return (
    <button
      onClick={!disabled ? onClick : undefined} // Jika disabled, onClick tidak jalan
      disabled={disabled}
      className={`relative flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-sm transition-all border border-gray-100 group w-full
        ${disabled ? "opacity-60 cursor-not-allowed grayscale-[0.5]" : "hover:shadow-md active:scale-95 cursor-pointer"}
      `}
    >
      {/* Badge Count (Hanya muncul jika tidak disabled dan ada data) */}
      {!disabled && count !== undefined && count > 0 && (
        <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
          {count}
        </div>
      )}

      {/* Badge Status (Sedang Perbaikan / Coming Soon) */}
      {badge && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[8px] font-black px-2 py-1 rounded-lg shadow-sm uppercase tracking-tighter whitespace-nowrap z-10 border border-white">
          {badge}
        </div>
      )}

      <div className={`p-3 rounded-2xl mb-3 transition-transform ${disabled ? "bg-gray-100 text-gray-400" : "bg-blue-100 text-blue-600 group-hover:scale-110"}`}>
        <Icon size={28} />
      </div>
      
      <span className={`text-xs font-bold text-center leading-tight ${disabled ? "text-gray-400" : "text-gray-700"}`}>
        {label}
      </span>
    </button>
  );
}