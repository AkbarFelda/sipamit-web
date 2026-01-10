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
  Building2,
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

  // State Management
  const [activeTab, setActiveTab] = useState<TabStatus>("Sedang Diproses");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState("Semua Tipe");
  const [displayLimit, setDisplayLimit] = useState(10);
  
  // State User & Wilayah (Diinisialisasi langsung dari Cookie untuk mencegah Cascading Render)
  const [userRole] = useState(() => Cookies.get("user_role") || "USER");
  const [selectedWilayah, setSelectedWilayah] = useState(() => Cookies.get("wilayah_id") || "");
  const [listWilayah, setListWilayah] = useState<Wilayah[]>([]);
  const [selectedPeriode, setSelectedPeriode] = useState(""); // Format: YYYY-MM

  const observerTarget = useRef(null);
  const { data, loading, error, refetch } = useSPK(slug, activeTab);

  // Fetch Daftar Wilayah untuk Dropdown
  useEffect(() => {
    const token = Cookies.get("user_token") || "";
    const fetchWilayah = async () => {
      try {
        const res = await spkService.getWilayah(token);
        setListWilayah(res);
      } catch (err) {
        console.error("Gagal load wilayah:", err);
      }
    };

    if (token) fetchWilayah();
  }, []);

  const handleReload = () => {
    setDisplayLimit(10);
    refetch?.();
  };

  // Infinite Scroll Observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !loading) {
        setDisplayLimit((prev) => prev + 10);
      }
    },
    [loading]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 1.0 });
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  const handleAction = (e: React.MouseEvent, type: "tel" | "map", value: string) => {
    e.stopPropagation();
    if (!value) return;
    if (type === "tel") {
      window.open(`tel:${value}`, "_self");
    } else {
      window.open(`http://googleusercontent.com/maps.google.com/${value}`, "_blank");
    }
  };

  // Client-side Filtering Logic
  const filteredData = Array.isArray(data)
    ? data.filter((item) => {
        const displayName = (item.nama || item.namajenis || item.no_aduan || "").toLowerCase();
        const displayAddress = (item.alamat || item.wilayah || "").toLowerCase();
        const search = searchQuery.toLowerCase();

        // 1. Filter Search
        const matchSearch = displayName.includes(search) || displayAddress.includes(search);

        // 2. Filter Kategori
        const matchType = filterType === "Semua Tipe" || item.jenis === filterType;

        // 3. Filter Wilayah
        const matchWilayah = !selectedWilayah || String(item.wilayah_id) === String(selectedWilayah);

        // 4. Logic Filter Periode Berdasarkan Slug (Hanya aktif di tab Selesai)
        let matchPeriode = true;
        if (selectedPeriode && activeTab === "Selesai") {
          const filterYYYYMM = selectedPeriode.replace("-", ""); // Ubah 2025-12 jadi 202512
          
          let itemPeriode = "";
          if (slug === "penyegelan") {
            itemPeriode = item.periode_segel || "";
          } else if (slug === "buka-segel") {
            itemPeriode = item.periode_bk_segel || "";
          } else {
            itemPeriode = item.periode_proses || "";
          }
          matchPeriode = String(itemPeriode).startsWith(filterYYYYMM);
        }

        return matchSearch && matchType && matchWilayah && matchPeriode;
      }).slice(0, displayLimit)
    : [];

  return (
    <MobileContainer className="bg-gray-50 flex flex-col min-h-screen pb-10 text-black">
      <HeaderPage fallbackPath={`/homepage`} title={title} />

      {/* Tabs Navigation */}
      <div className="flex bg-white border-b sticky top-0 z-10">
        {(["Sedang Diproses", "Selesai"] as TabStatus[]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setIsFilterOpen(false);
              setDisplayLimit(10);
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
        {/* Search Bar & Actions */}
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
            onClick={handleReload}
            className="p-2.5 bg-white text-gray-600 border border-gray-200 rounded-2xl active:rotate-180 transition-all duration-500 shadow-sm"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-2.5 rounded-2xl border transition-all shadow-sm ${
              isFilterOpen ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            {isFilterOpen ? <X size={20} /> : <Filter size={20} />}
          </button>
        </div>

        {/* MODAL FILTER DYNAMIS */}
        {isFilterOpen && (
          <div className="bg-white p-5 rounded-4xl border border-blue-100 shadow-xl animate-in slide-in-from-top duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-gray-800 font-bold text-sm">
                <Filter size={16} className="text-blue-600" /> Filter Data
              </div>
              <button 
                onClick={() => {setSelectedWilayah(Cookies.get("wilayah_id") || ""); setSelectedPeriode("");}} 
                className="text-[10px] text-red-500 font-bold uppercase"
              >
                Reset
              </button>
            </div>

            {/* Row Berdampingan: Wilayah & Periode */}
            <div className="grid grid-cols-2 gap-3">
              {/* Filter Wilayah */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Wilayah</label>
                <div className="relative">
                  <select
                    value={selectedWilayah}
                    onChange={(e) => setSelectedWilayah(e.target.value)}
                    disabled={userRole !== "USER"}
                    className={`w-full border text-black text-xs rounded-2xl px-3 py-3 outline-none appearance-none font-bold shadow-sm transition-all ${
                      userRole !== "USER"
                        ? "bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed"
                        : "bg-gray-50 border-gray-200 focus:border-blue-500"
                    }`}
                  >
                    {userRole === "ADMINISTRATOR" && <option value="">Semua</option>}
                    {listWilayah.map((w) => (
                      <option key={w.id} value={w.id}>{w.nama}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <Building2 size={14} />
                  </div>
                </div>
              </div>

              {/* Filter Periode */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Periode</label>
                {activeTab === "Selesai" ? (
                  <input
                    type="month"
                    value={selectedPeriode}
                    onChange={(e) => setSelectedPeriode(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-black text-xs rounded-2xl px-3 py-2.75 outline-none font-bold shadow-sm focus:border-blue-500"
                  />
                ) : (
                  <div className="bg-gray-100 text-gray-400 text-[10px] flex items-center justify-center rounded-2xl h-10.5 italic border border-gray-100 uppercase font-bold">
                    N/A
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsFilterOpen(false)}
              className="w-full mt-5 bg-blue-600 text-white text-xs font-black py-4 rounded-2xl active:scale-95 transition-all shadow-lg"
            >
              TERAPKAN FILTER
            </button>
          </div>
        )}

        {/* Loading Overlay for first load */}
        {loading && displayLimit === 10 && <LoadingOverlay message={`Sinkronisasi data...`} />}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold text-center border border-red-100">
            {error}
          </div>
        )}

        {/* Data List */}
        {!loading && (
          <div className="space-y-3">
            {filteredData.map((item) => {
              const displayTitle = item.nama || item.namajenis || item.no_aduan || "Tanpa Nama";
              const displaySubTitle = item.no_regis || item.no_pelanggan || item.no_aduan || "-";
              const displayAddress = item.alamat || (item.kel ? `${item.kelurahan}, ${item.wilayah}` : item.wilayah) || "Alamat tidak tersedia";
              const displayDate = item.tglrab || item.tanggal || "-";
              const contactInfo = item.no_hp || item.no_telp || "";
              const mapLocation = item.latitude ? `${item.latitude},${item.longitude}` : item.alamat || "";

              return (
                <div
                  key={item.id}
                  onClick={() => router.push(`/spk/${slug}/${item.id}`)}
                  className="bg-white p-4 rounded-[28px] shadow-sm border border-gray-100 flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="bg-blue-50 p-1 rounded-md text-blue-600">
                        <Tag size={12} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                        {displaySubTitle}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm leading-tight group-hover:text-blue-600 transition-colors">
                      {displayTitle}
                    </h3>
                    <div className="flex items-start gap-1">
                      <MapPin size={12} className="text-gray-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-gray-500 leading-tight line-clamp-2">{displayAddress}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[9px] text-gray-400 font-medium italic">
                      <Calendar size={10} />
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
                        contactInfo ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-300"
                      }`}
                    >
                      <Phone size={18} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Pagination / Loading More */}
            {filteredData.length >= 10 && (
              <div ref={observerTarget} className="py-4 flex justify-center">
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                ) : (
                  <p className="text-[10px] text-gray-400 italic">Menampilkan {filteredData.length} data</p>
                )}
              </div>
            )}

            {/* Empty State */}
            {filteredData.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-2">
                <Search size={40} className="opacity-20" />
                <p className="text-sm italic text-center px-10">Data tidak ditemukan untuk filter ini</p>
              </div>
            )}
          </div>
        )}
      </div>
    </MobileContainer>
  );
}