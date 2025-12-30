"use client";

import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  message?: string;
}

export default function LoadingOverlay({
  message = "Memuat Data...",
}: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-white/60 backdrop-blur-[2px] transition-all">
      <div className="bg-white p-6 rounded-4xl shadow-2xl border border-gray-100 flex flex-col items-center gap-4 animate-in zoom-in duration-300">
        <div className="relative">
          <Loader2
            className="text-blue-600 animate-spin"
            size={48}
            strokeWidth={3}
          />

          <div className="absolute inset-0 blur-xl bg-blue-400/30 animate-pulse -z-10"></div>
        </div>

        {message && (
          <p className="text-sm font-bold text-gray-700 tracking-wide animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
