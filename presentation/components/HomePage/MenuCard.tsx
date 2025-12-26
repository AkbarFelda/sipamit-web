"use client";

import { LucideIcon } from "lucide-react";

interface MenuCardProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  iconColor?: string;
}

export default function MenuCard({ icon: Icon, label, onClick, iconColor = "text-blue-600" }: MenuCardProps) {
  return (
    <button 
      onClick={onClick}
      className="aspect-square bg-white/80 rounded-3xl shadow-sm backdrop-blur-sm 
                 active:scale-95 transition-all flex flex-col items-center justify-center gap-3 p-4"
    >
      <div className={`p-3 rounded-2xl bg-gray-50 ${iconColor}`}>
        <Icon size={32} strokeWidth={2.5} />
      </div>
      <span className="text-sm font-bold text-gray-800">{label}</span>
    </button>
  );
}