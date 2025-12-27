"use client";

import { LucideIcon } from "lucide-react";

interface MenuCardProps {
  icon: LucideIcon;
  label: string;
  count?: number;
  onClick?: () => void;
}

export default function MenuCard({
  icon: Icon,
  label,
  count,
  onClick,
}: MenuCardProps) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all border border-gray-100 group"
    >
      {count !== undefined && count > 0 && (
        <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
          {count}
        </div>
      )}

      <div className="p-3 bg-blue-100 rounded-2xl text-blue-600 mb-3 group-hover:scale-110 transition-transform">
        <Icon size={28} />
      </div>
      <span className="text-xs font-bold text-gray-700 text-center leading-tight">
        {label}
      </span>
    </button>
  );
}
