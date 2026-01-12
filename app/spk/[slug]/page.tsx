"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import LoadingOverlay from "@/presentation/components/LoadingOverlay";
import Cookies from "js-cookie";
import { spkService } from "@/core/services/spkService";
import { Wilayah } from "@/core/types/filter";

type TabStatus = "Sedang Diproses" | "Selesai";

export default function SPKDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";
  const title = slug ? slug.replace(/-/g, " ").toUpperCase() : "DETAIL DATA";

  // Tab & Search States
  const [activeTab, setActiveTab] = useState<TabStatus>("Sedang Diproses");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // State Dropdown (Draft) - Diambil dari Cookie hanya untuk default dropdown
  const [selectedWilayah, setSelectedWilayah] = useState(() => Cookies.get("wilayah_id") || "");
  const [selectedPeriode, setSelectedPeriode] = useState("");
  
  // State yang BENAR-BENAR nyaring data (Applied) - Awalnya kosong agar tampil semua
  const [appliedWilayah, setAppliedWilayah] = useState("");
  const [appliedPeriode, setAppliedPeriode] = useState("");

  const [listWilayah, setListWilayah] = useState<Wilayah[]>([]);
  const observerTarget = useRef<HTMLDivElement>(null);
  
  // Mengambil data dari Hook
  const { data, loading, error, fetchData, hasMore, refetch } = useSPK(slug, activeTab);
  
  const userRole = Cookies.get("role") || "USER";
  const isAdmin = String(userRole).trim().toUpperCase() === "ADMINISTRATOR";

  // 1. Load Daftar Wilayah (Sekali saja)
  useEffect(() => {
    const token = Cookies.get("user_token") || "";
    spkService.getWilayah(token).then(setListWilayah).catch(console.error);
  }, []);

  // 2. Logic Tombol Terapkan & Reset
  const handleApplyFilter = () => {
    setAppliedWilayah(selectedWilayah);
    setAppliedPeriode(selectedPeriode);
    setIsFilterOpen(false);
  };

  const handleResetFilter = () => {
    setSelectedWilayah("");
    setSelectedPeriode("");
    setAppliedWilayah("");
    setAppliedPeriode("");
    setIsFilterOpen(false);
  };

  // 3. Handle Infinite Scroll (Anti-Looping)
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      // Hanya panggil page selanjutnya jika terlihat, tidak sedang loading, masih ada data,
      // dan minimal sudah ada data awal (mencegah looping saat data kosong)
      if (target.isIntersecting && !loading && hasMore && data.length >= 10) {
        const nextPage = Math.floor(data.length / 10) + 1;
        fetchData(nextPage);
      }
    },
    [loading, hasMore, data.length, fetchData]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  // 4. Handle Action (Map & Tel)
  const handleAction = (e: React.MouseEvent, type: "tel" | "map", value: string) => {
    e.stopPropagation();
    if (!value) return;
    if (type === "tel") {
      window.open(`tel:${value}`, "_self");
    } else {
      window.open(`http://googleusercontent.com/maps.google.com/?q=${encodeURIComponent(value)}`, "_blank");
    }
  };

  // 5. Logic Filter Client-side (Wilayah & Periode)
  const filteredData = Array.isArray(data)
    ? data.filter((item) => {
        const s = searchQuery.toLowerCase();
        const displayName = (item.nama || item.namajenis || "").toLowerCase();
        const displayAddress = (item.alamat || "").toLowerCase();
        const displayNo = (item.no_pelanggan || item.no_aduan || "").toLowerCase();

        // Search Filter
        const matchSearch = displayName.includes(s) || displayAddress.includes(s) || displayNo.includes(s);

        // Wilayah Filter (Tampil semua jika appliedWilayah kosong)
        const matchWilayah = !appliedWilayah || String(item.wilayah_id) === String(appliedWilayah);

        // Periode Filter (Tampil semua jika appliedPeriode kosong)
        let matchPeriode = true;
        if (appliedPeriode && activeTab === "Selesai") {
          const filterYM = appliedPeriode.replace("-", "");
          const itemYM = String(
            item.periode_segel || 
            item.periode_bk_segel || 
            item.periode_proses || 
            item.periode || 
            ""
          );
          matchPeriode = itemYM.includes(filterYM);
        }

        return matchSearch && matchWilayah && matchPeriode;
      })
    : [];

  return (
    <MobileContainer className="bg-gray-50 flex flex-col min-h-screen pb-10 text-black">
      <HeaderPage fallbackPath={`/homepage`} title={title} />

      {/* Tab Menu */}
      <div className="flex bg-white border-b sticky top-0 z-20">
        {(["Sedang Diproses", "Selesai"] as TabStatus[]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              handleResetFilter(); // Reset filter setiap ganti tab agar data muncul semua
            }}
            className={`flex-1 py-4 text-sm font-bold transition-all ${
              activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-4">
        {/* Search & Tool Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari pelanggan..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => refetch()}
            className="p-2.5 bg-white text-gray-600 border border-gray-200 rounded-2xl shadow-sm active:scale-90 transition-transform"
          >
            <RefreshCw size={20} className={loading && data.length === 0 ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-2.5 rounded-2xl border transition-all shadow-sm ${
              isFilterOpen || appliedWilayah || appliedPeriode
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            {isFilterOpen ? <X size={20} /> : <Filter size={20} />}
          </button>
        </div>

        {/* Modal Filter */}
        {isFilterOpen && (
          <div className="bg-white p-5 rounded-4xl border border-blue-100 shadow-xl animate-in slide-in-from-top duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-gray-800 font-bold text-sm">
                <Filter size={16} className="text-blue-600" /> Filter Data
              </div>
              <button onClick={handleResetFilter} className="text-[10px] text-red-500 font-bold uppercase">
                Reset
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Wilayah</label>
                <div className="relative">
                  <select
                    value={selectedWilayah}
                    onChange={(e) => setSelectedWilayah(e.target.value)}
                    disabled={!isAdmin}
                    className={`w-full border text-xs rounded-2xl px-3 py-3 outline-none appearance-none font-bold shadow-sm ${
                      !isAdmin ? "bg-gray-100 text-gray-500 border-gray-100" : "bg-white border-gray-200"
                    }`}
                  >
                    <option value="">Semua Wilayah</option>
                    {listWilayah.map((w) => (
                      <option key={w.id} value={w.id}>{w.nama}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" size={14} />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Periode</label>
                {activeTab === "Selesai" ? (
                  <input
                    type="month"
                    value={selectedPeriode}
                    onChange={(e) => setSelectedPeriode(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-black text-xs rounded-2xl px-3 py-2.5 outline-none font-bold"
                  />
                ) : (
                  <div className="bg-gray-100 text-gray-400 text-[10px] flex items-center justify-center rounded-2xl h-10.5 italic border border-gray-100 uppercase font-bold">
                    N/A
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleApplyFilter}
              className="w-full mt-5 bg-blue-600 text-white text-xs font-black py-4 rounded-2xl active:scale-95 transition-all shadow-lg"
            >
              TERAPKAN FILTER
            </button>
          </div>
        )}

        {loading && data.length === 0 && <LoadingOverlay message="Sinkronisasi data..." />}

        {/* List Card SPK */}
        <div className="space-y-3">
          {filteredData.map((item, index) => {
            // Fix Purity for Date
            const dateValue = item.tanggal || item.tglrab;
            const formattedDate = dateValue 
              ? new Date(dateValue).toLocaleDateString("id-ID", {
                  day: "numeric", month: "short", year: "numeric"
                })
              : "-";

            return (
              <div
                key={`${item.id}-${index}`}
                onClick={() => router.push(`/spk/${slug}/${item.id}`)}
                className="bg-white p-4 rounded-[28px] shadow-sm border border-gray-100 flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer group"
              >
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="bg-blue-50 p-1 rounded-md text-blue-600">
                      <Tag size={12} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                      {item.no_pelanggan || item.no_aduan || "-"}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                    {item.nama || item.namajenis || "Tanpa Nama"}
                  </h3>
                  <div className="flex items-start gap-1">
                    <MapPin size={12} className="text-gray-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-gray-500 leading-tight line-clamp-1">
                      {item.alamat || "Alamat tidak tersedia"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[9px] text-gray-400 font-medium italic">
                    <Calendar size={10} />
                    {formattedDate}
                  </div>
                </div>

                <div className="flex flex-col gap-2 border-l pl-3 border-gray-100">
                  <button
                    onClick={(e) => handleAction(e, "map", item.alamat || "")}
                    className="p-3 bg-green-50 text-green-600 rounded-2xl active:scale-90 transition-transform"
                  >
                    <MapIcon size={18} />
                  </button>
                  <button
                    onClick={(e) => handleAction(e, "tel", item.no_hp || item.no_telp || "")}
                    disabled={!(item.no_hp || item.no_telp)}
                    className={`p-3 rounded-2xl active:scale-90 transition-transform ${
                      (item.no_hp || item.no_telp) ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-200"
                    }`}
                  >
                    <Phone size={18} />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Observer Target & Load More Status */}
          <div ref={observerTarget} className="py-10 flex flex-col items-center justify-center gap-2">
            {loading && data.length > 0 && (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                <p className="text-[10px] text-gray-400">Memuat data...</p>
              </>
            )}
            {!hasMore && data.length > 0 && (
              <p className="text-[10px] text-gray-400 italic font-medium">
                Semua data telah ditampilkan
              </p>
            )}
            {filteredData.length === 0 && !loading && !error && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-2">
                <Search size={40} className="opacity-20" />
                <p className="text-sm italic text-center px-10">Data tidak ditemukan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MobileContainer>
  );
}