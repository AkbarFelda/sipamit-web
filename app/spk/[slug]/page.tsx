"use client";

import { useState } from "react";
import MobileContainer from "@/presentation/components/MobileContainer";
import HeaderPage from "@/presentation/components/HeaderPage";
import { useParams, useRouter } from "next/navigation";
import { useSPK } from "@/presentation/hooks/useSPK";
import {
  MapPin,
  Calendar,
  Search,
  Phone,
  Map as MapIcon,
  Filter,
  X,
  Tag,
} from "lucide-react";
import LoadingOverlay from "@/presentation/components/LoadingOverlay";

type TabStatus = "Sedang Diproses" | "Selesai";

export default function SPKDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";
  const title = slug ? slug.replace(/-/g, " ").toUpperCase() : "DETAIL DATA";
  const [activeTab, setActiveTab] = useState<TabStatus>("Sedang Diproses");
  const [searchQuery, setSearchQuery] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState("Semua Tipe");

  const { data, loading, error } = useSPK(slug, activeTab);

  const handleAction = (
    e: React.MouseEvent,
    type: "tel" | "map",
    value: string
  ) => {
    e.stopPropagation();
    if (!value) return;
    if (type === "tel") {
      window.open(`tel:${value}`, "_self");
    } else {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${value}`,
        "_blank"
      );
    }
  };

  const filteredData = Array.isArray(data)
    ? data.filter((item) => {
        const displayName = (
          item.nama ||
          item.namajenis ||
          item.no_aduan ||
          ""
        ).toLowerCase();
        const displayAddress = (
          item.alamat ||
          item.wilayah ||
          ""
        ).toLowerCase();
        const search = searchQuery.toLowerCase();

        // Logika tambahan jika filterType diaktifkan (contoh mapping sederhana)
        const matchFilter =
          filterType === "Semua Tipe" || item.jenis === filterType;

        return (
          (displayName.includes(search) || displayAddress.includes(search)) &&
          matchFilter
        );
      })
    : [];

  return (
    <MobileContainer className="bg-gray-50 flex flex-col min-h-screen pb-10 text-black">
      <HeaderPage title={title} />

      <div className="flex bg-white border-b sticky top-0 z-10">
        {(["Sedang Diproses", "Selesai"] as TabStatus[]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setIsFilterOpen(false);
            }}
            className={`flex-1 py-4 text-sm font-bold transition-all ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-4">
        {/* --- SEARCH & TOMBOL FILTER --- */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari pelanggan atau jenis..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-2.5 rounded-2xl border transition-all ${
              isFilterOpen
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            {isFilterOpen ? <X size={20} /> : <Filter size={20} />}
          </button>
        </div>

        {/* --- PANEL FILTER (YANG DITAMBAHKAN) --- */}
        {isFilterOpen && (
          <div className="bg-white p-5 rounded-4xl border border-blue-100 shadow-sm animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold text-sm">
              <Filter size={16} className="text-blue-600" /> Filter Pencarian
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-black uppercase ml-1">
                  Kategori
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-gray-50 border text-black border-gray-200 text-xs rounded-xl px-2 py-2.5 outline-none"
                >
                  <option>Semua Tipe</option>
                  <option value="SBK">Sambung Kembali</option>
                  <option value="PWM">Pindah Meter</option>
                  <option>Prioritas</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-black uppercase ml-1">
                  Periode
                </label>
                <div className="bg-gray-100 text-gray-400 text-[10px] flex items-center justify-center rounded-xl h-10 italic border border-gray-200 text-center uppercase font-bold">
                  {activeTab === "Selesai" ? "Desember 2025" : "N/A"}
                </div>
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

        {loading && <LoadingOverlay message={`Sinkronisasi data...`} />}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold text-center border border-red-100">
            {error}
          </div>
        )}

        {!loading && (
          <div className="space-y-3">
            {filteredData.map((item) => {
              const displayTitle =
                item.nama || item.namajenis || item.no_aduan || "Tanpa Nama";
              const displaySubTitle =
                item.no_regis || item.no_pelanggan || item.no_aduan || "-";
              const displayAddress =
                item.alamat ||
                (item.kel
                  ? `${item.kelurahan}, ${item.wilayah}`
                  : item.wilayah) ||
                "Alamat tidak tersedia";
              const displayDate = item.tglrab || item.tanggal || "-";
              const contactInfo = item.no_hp || item.no_telp || "";
              const mapLocation = item.latitude
                ? `${item.latitude},${item.longitude}`
                : item.alamat || "";

              return (
                <div
                  key={item.id}
                  onClick={() => router.push(`/spk/${slug}/${item.id}`)}
                  className="bg-white p-4 rounded-[28px] shadow-sm border border-gray-100 flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <div className="flex-1 flex flex-col gap-1">
                    {displaySubTitle && displaySubTitle !== "-" && (
                      <div className="flex items-center gap-2 mb-1">
                        <div className="bg-blue-50 p-1 rounded-md text-blue-600">
                          <Tag size={12} />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                          {displaySubTitle}
                        </span>
                      </div>
                    )}

                    <h3 className="font-bold text-gray-800 text-sm leading-tight group-hover:text-blue-600 transition-colors">
                      {displayTitle}
                    </h3>

                    <div className="flex items-start gap-1">
                      <MapPin
                        size={12}
                        className="text-gray-400 shrink-0 mt-0.5"
                      />
                      <p className="text-[11px] text-gray-500 leading-tight line-clamp-2">
                        {displayAddress}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 mt-1 text-[9px] text-gray-400 font-medium italic">
                      <Calendar size={10} />{" "}
                      {new Date(displayDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 border-l pl-3 border-gray-100">
                    <button
                      onClick={(e) => handleAction(e, "map", mapLocation)}
                      className="p-3 bg-green-50 text-green-600 rounded-2xl active:scale-90 transition-transform"
                    >
                      <MapIcon size={18} />
                    </button>
                    <button
                      onClick={(e) => handleAction(e, "tel", contactInfo)}
                      disabled={!contactInfo}
                      className={`p-3 rounded-2xl active:scale-90 transition-transform ${
                        contactInfo
                          ? "bg-blue-50 text-blue-600"
                          : "bg-gray-50 text-gray-300"
                      }`}
                    >
                      <Phone size={18} />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredData.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-2">
                <Search size={40} className="opacity-20" />
                <p className="text-sm italic">Data {slug} tidak ditemukan</p>
              </div>
            )}
          </div>
        )}
      </div>
    </MobileContainer>
  );
}
