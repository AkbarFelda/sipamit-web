"use client";

import { useState } from "react";
import MobileContainer from "@/presentation/components/MobileContainer";
import HeaderPage from "@/presentation/components/HeaderPage";
import { useParams, useRouter } from "next/navigation";
import {
  User,
  MapPin,
  Calendar,
  Search,
  Phone,
  Map as MapIcon,
  Filter,
  X,
} from "lucide-react";

type TabStatus = "Sedang Diproses" | "Selesai";

export default function SPKDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";
  const title = slug ? slug.replace(/-/g, " ").toUpperCase() : "DETAIL DATA";

  // --- STATE ---
  const [activeTab, setActiveTab] = useState<TabStatus>("Sedang Diproses");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State Filter diaktifkan lagi
  const [filterType, setFilterType] = useState("Semua Tipe");
  const [selectedPeriode, setSelectedPeriode] = useState("Semua");

  const pelangganList = [
    {
      id: "101",
      nama: "Rudolf Santoso",
      alamat: "Jl. Magelang KM 12, Sleman, Yogyakarta",
      tgl: "26 Des 2025",
      status: "Sedang Diproses",
      phone: "08123456789",
      latlong: "-7.716,110.364",
    },
    {
      id: "102",
      nama: "Syra Alaxandra",
      alamat: "Perum Sleman Permai II, Blok C-10",
      tgl: "27 Des 2025",
      status: "Selesai",
      phone: "08987654321",
      latlong: "-7.721,110.355",
    },
  ];

  const handleAction = (e: React.MouseEvent, type: "tel" | "map", value: string) => {
    e.stopPropagation();
    if (type === "tel") window.open(`tel:${value}`, "_self");
    else window.open(`https://www.google.com/maps/search/?api=1&query=${value}`, "_blank");
  };

  const filteredData = pelangganList.filter(
    (item) =>
      item.status === activeTab &&
      (item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.alamat.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <MobileContainer className="bg-gray-50 flex flex-col min-h-screen pb-10 text-black">
      <HeaderPage title={title} />

      {/* --- TAB BAR --- */}
      <div className="flex bg-white border-b sticky top-0 z-10">
        {(["Sedang Diproses", "Selesai"] as TabStatus[]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setIsFilterOpen(false);
            }}
            className={`flex-1 py-4 text-sm font-bold transition-all ${
              activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* --- SEARCH & FILTER ICON --- */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari Nama atau Alamat..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-2.5 rounded-2xl border transition-all ${
              isFilterOpen ? "bg-blue-600 text-white shadow-lg border-blue-600" : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            {isFilterOpen ? <X size={20} /> : <Filter size={20} />}
          </button>
        </div>

        {/* --- PANEL FILTER (MUNCUL JIKA ICON DIKLIK) --- */}
        {isFilterOpen && (
          <div className="bg-white p-5 rounded-[32px] border border-blue-100 shadow-sm animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold text-sm">
              <Filter size={16} className="text-blue-600" /> Filter Pencarian
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-black uppercase ml-1">Kategori</label>
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-gray-50 border text-black border-gray-200 text-xs rounded-xl px-2 py-2.5 outline-none"
                >
                  <option>Semua Tipe</option>
                  <option>Prioritas</option>
                  <option>Reguler</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-black uppercase ml-1">Periode</label>
                {activeTab === "Selesai" ? (
                  <select 
                    value={selectedPeriode}
                    onChange={(e) => setSelectedPeriode(e.target.value)}
                    className="bg-gray-50 border text-black border-gray-200 text-xs rounded-xl px-2 py-2.5 outline-none"
                  >
                    <option>Semua Periode</option>
                    <option>Desember 2025</option>
                  </select>
                ) : (
                  <div className="bg-gray-100 text-gray-400 text-[10px] flex items-center justify-center rounded-xl h-[38px] italic border border-gray-200 text-center uppercase font-bold">N/A</div>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="w-full mt-4 bg-blue-600 text-white text-xs font-bold py-3 rounded-2xl active:scale-95 transition-transform"
            >
              TERAPKAN FILTER
            </button>
          </div>
        )}

        {/* --- LIST VIEW --- */}
        <div className="flex flex-col gap-3">
          {filteredData.map((pelanggan) => (
            <div
              key={pelanggan.id}
              onClick={() => router.push(`/spk/${slug}/${pelanggan.id}`)}
              className="bg-white p-4 rounded-[28px] shadow-sm border border-gray-100 flex flex-row items-center gap-4 active:scale-[0.98] transition-all cursor-pointer group"
            >
              {/* INFO TEKS (KIRI) */}
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="bg-blue-50 p-1 rounded-md text-blue-600">
                    <User size={14} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                    #{pelanggan.id}
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-800 text-sm leading-tight group-hover:text-blue-600 transition-colors">
                  {pelanggan.nama}
                </h3>
                
                <div className="flex items-start gap-1">
                  <MapPin size={12} className="text-gray-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-gray-500 leading-tight">
                    {pelanggan.alamat}
                  </p>
                </div>

                <div className="flex items-center gap-1 mt-1 text-[9px] text-gray-400 font-medium italic">
                  <Calendar size={10} /> {pelanggan.tgl}
                </div>
              </div>

              {/* ACTION BUTTONS (KANAN - VERTIKAL) */}
              <div className="flex flex-col gap-2 border-l pl-3 border-gray-100">
                <button
                  onClick={(e) => handleAction(e, "map", pelanggan.latlong)}
                  className="p-3 bg-green-50 text-green-600 rounded-2xl active:bg-green-100 transition-colors shadow-sm"
                >
                  <MapIcon size={18} />
                </button>
                <button
                  onClick={(e) => handleAction(e, "tel", pelanggan.phone)}
                  className="p-3 bg-blue-50 text-blue-600 rounded-2xl active:bg-blue-100 transition-colors shadow-sm"
                >
                  <Phone size={18} />
                </button>
              </div>
            </div>
          ))}

          {filteredData.length === 0 && (
            <div className="text-center py-20 text-gray-400 text-sm italic">
              Tidak ada data pelanggan ditemukan
            </div>
          )}
        </div>
      </div>
    </MobileContainer>
  );
}