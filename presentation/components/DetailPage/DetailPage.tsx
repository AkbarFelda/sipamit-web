"use client";

import { ReactNode } from "react";

/** COMPONENT: Badge ID **/
export function Badge({
  label,
  color,
}: {
  label: string;
  color: "orange" | "green" | "blue" | "purple";
}) {
  const styles = {
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    green: "bg-green-50 text-green-600 border-green-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };
  return (
    <span className={`${styles[color]} text-[10px] px-3 py-1 rounded-lg font-black border uppercase tracking-tight`}>
      {label}
    </span>
  );
}

/** COMPONENT: Mini Info (Alamat/Wilayah) **/
export function MiniInfo({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined | null;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] text-gray-400 font-bold uppercase">{label}</span>
      <span className="text-[11px] text-gray-800 font-bold truncate">{value || "-"}</span>
    </div>
  );
}

/** COMPONENT: Info Box (Detail Teknis) **/
interface InfoBoxProps {
  label: string;
  value: string | number | null | undefined;
  icon: ReactNode;
  className?: string;
}

export function InfoBox({ label, value, icon, className = "" }: InfoBoxProps) {
  return (
    <div className={`p-3 bg-gray-50 rounded-2xl border border-gray-100 ${className}`}>
      <div className="flex items-center gap-2 mb-1 text-gray-400">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xs font-bold text-gray-800">{value || "Belum diisi"}</p>
    </div>
  );
}

/** COMPONENT: Cost Item (Rincian Biaya) **/
interface CostItemProps {
  label: string;
  value: string | number | null | undefined;
  isDiscount?: boolean;
}

export function CostItem({ label, value, isDiscount = false }: CostItemProps) {
  const formatValue = (val: string | number | null | undefined) => {
    const num = typeof val === "string" ? parseFloat(val) : val || 0;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className={`font-bold ${isDiscount ? "text-red-500" : "text-gray-800"}`}>
        {isDiscount && value && Number(value) !== 0 ? "- " : ""}
        {formatValue(value)}
      </span>
    </div>
  );
}