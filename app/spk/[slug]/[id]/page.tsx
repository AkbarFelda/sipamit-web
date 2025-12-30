"use client";

import { useState, use, ReactNode } from "react";
import MobileContainer from "@/presentation/components/MobileContainer";
import HeaderPage from "@/presentation/components/HeaderPage";
import LoadingOverlay from "@/presentation/components/LoadingOverlay";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Phone,
  ClipboardList,
  CheckSquare,
  Image as ImageIcon,
  X,
  CreditCard,
  Tag,
  Building2,
  Calendar,
  Layers,
  Drill,
  Droplets,
  Mail,
} from "lucide-react";
import Image from "next/image";
import { useSPKDetail } from "@/presentation/hooks/useSPKDetail";

// Define strong interfaces for sub-components to avoid 'any'
interface InfoBoxProps {
  label: string;
  value: string | number | null | undefined;
  icon: ReactNode;
  className?: string;
}

interface CostItemProps {
  label: string;
  value: string | number | null | undefined;
  isDiscount?: boolean;
}

export default function DetailPelangganPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { id, slug } = use(params);
  const router = useRouter();

  const { detail, loading, error } = useSPKDetail(slug, id);
  const [isImgOpen, setIsImgOpen] = useState(false);

  const formatRupiah = (amount: number | string | undefined | null) => {
    const value = typeof amount === "string" ? parseFloat(amount) : amount || 0;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) return <LoadingOverlay message="Sinkronisasi data teknis..." />;

  if (error) {
    return (
      <MobileContainer className="bg-gray-50 flex flex-col items-center justify-center min-h-screen text-black">
        <div className="text-center p-6">
          <p className="text-red-500 font-bold mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow-lg"
          >
            Kembali
          </button>
        </div>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer className="bg-gray-50 flex flex-col min-h-screen pb-32 text-black">
      <HeaderPage title={`Detail ${slug.replace(/-/g, " ").toUpperCase()}`} />

      <div className="p-6 space-y-6">
        {/* SECTION 1: PROFIL UTAMA */}
        <div className="bg-white p-6 rounded-4xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg ring-4 ring-blue-50">
            {(detail?.nama || detail?.namajenis || "U")
              .substring(0, 2)
              .toUpperCase()}
          </div>
          <h2 className="text-xl font-black text-gray-800 capitalize leading-tight">
            {detail?.nama || detail?.namajenis}
          </h2>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {detail?.no_aduan && (
              <Badge label={`ADUAN: ${detail.no_aduan}`} color="orange" />
            )}
            {detail?.no_regis && (
              <Badge label={`REG: ${detail.no_regis}`} color="green" />
            )}
            {detail?.no_pelanggan && (
              <Badge label={`PEL: ${detail.no_pelanggan}`} color="blue" />
            )}
            {detail?.no_rab && (
              <Badge label={`RAB: ${detail.no_rab}`} color="purple" />
            )}
          </div>
        </div>

        {/* SECTION 2: FOTO BUKTI (Hanya tampil jika slug adalah pengaduan) */}
        {slug === "pengaduan" && (
          <div className="bg-white p-5 rounded-4xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3 text-sm">
              <ImageIcon size={18} className="text-blue-600" /> Foto Lampiran
              SPK
            </h3>
            {detail?.url_foto_aduan ? (
              <div
                className="relative w-full h-48 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 cursor-pointer group"
                onClick={() => setIsImgOpen(true)}
              >
                <Image
                  src={detail.url_foto_aduan}
                  alt="Foto Lampiran"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white">
                    <X className="rotate-45" />
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                <ImageIcon size={32} strokeWidth={1} />
                <p className="text-[10px] font-bold mt-2">
                  Tidak ada lampiran foto
                </p>
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: LOKASI & KONTAK */}
        <div className="bg-white p-5 rounded-4xl shadow-sm border border-gray-100 space-y-5">
          <div className="flex items-start gap-4">
            <div className="bg-green-50 p-3 rounded-2xl text-green-600">
              <MapPin size={22} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Informasi Lokasi
              </p>
              <p className="text-sm text-gray-800 font-bold leading-relaxed">
                {detail?.alamat || "Alamat tidak diisi"}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-y-2 gap-x-1 border-t border-gray-50 pt-2">
                <MiniInfo label="Rayon" value={detail?.rayon} />
                <MiniInfo label="Wilayah" value={detail?.wilayah} />
                <MiniInfo
                  label="Kecamatan"
                  value={detail?.kecamatan || detail?.kec}
                />
                <MiniInfo
                  label="Kelurahan"
                  value={detail?.kelurahan || detail?.kel}
                />
              </div>
              <button
                disabled={!detail?.latitude}
                onClick={() =>
                  window.open(
                    `http://googleusercontent.com/maps.google.com/?q=${detail?.latitude},${detail?.longitude}`,
                    "_blank"
                  )
                }
                className="mt-2 text-blue-600 font-black text-[10px] uppercase underline disabled:text-gray-300"
              >
                Navigasi Maps
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
              <Phone size={22} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Informasi Kontak
              </p>
              <p className="text-sm text-gray-800 font-bold">
                {detail?.no_hp || detail?.no_telp || "-"}
              </p>
              {detail?.email && (
                <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                  <Mail size={10} /> {detail.email}
                </p>
              )}
              <button
                disabled={!detail?.no_hp}
                onClick={() => window.open(`tel:${detail?.no_hp}`, "_self")}
                className="mt-2 text-blue-600 font-black text-[10px] uppercase underline disabled:text-gray-300"
              >
                Hubungi Sekarang
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 4: DATA TEKNIS */}
        <div className="bg-white p-5 rounded-4xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-2 text-sm">
            <ClipboardList size={18} className="text-blue-600" /> Detail Teknis
            Pekerjaan
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <InfoBox
              label="Tanggal Tugas"
              value={detail?.tanggal || detail?.tglrab}
              icon={<Calendar size={14} />}
            />
            <InfoBox
              label="Diameter Meter"
              value={detail?.diameter}
              icon={<Drill size={14} />}
            />
            <InfoBox
              label="Jenis Bangunan"
              value={detail?.jenis_bangunan}
              icon={<Building2 size={14} />}
            />
            <InfoBox
              label="Kepemilikan"
              value={detail?.kepemilikan}
              icon={<Tag size={14} />}
            />
            <InfoBox
              label="Tipe Layanan"
              value={detail?.namajenis}
              icon={<Layers size={14} />}
              className="col-span-2"
            />
            <InfoBox
              label="Masalah/Aduan"
              value={detail?.jenis_aduan}
              icon={<Droplets size={14} />}
              className="col-span-2 bg-orange-50/50 border-orange-100 text-orange-900"
            />
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
              Catatan/Keterangan:
            </p>
            <p className="text-xs text-gray-700 leading-relaxed italic">
              {detail?.ket_aduan ||
                detail?.keterangan ||
                "Tidak ada catatan tambahan"}
            </p>
          </div>
        </div>

        {/* SECTION 5: RINCIAN BIAYA */}
        <div className="bg-white p-5 rounded-4xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4 text-sm">
            <CreditCard size={18} className="text-blue-600" /> Rincian Transaksi
            & Biaya
          </h3>
          <div className="space-y-3">
            <CostItem label="Biaya Peralatan" value={detail?.biaya_peralatan} />
            <CostItem label="Ongkos Pasang" value={detail?.biaya_ongkos} />
            <CostItem label="Biaya Survey" value={detail?.biaya_survey} />
            <CostItem label="Jasa Lingkungan (JL)" value={detail?.biaya_jl} />
            <CostItem label="Biaya Lainnya" value={detail?.biaya_lainnya} />
            <CostItem label="Pajak (PPN)" value={detail?.ppn} />
            <CostItem label="Diskon" value={detail?.diskon} isDiscount />
            <CostItem
              label="Biaya Buka Segel"
              value={detail?.biaya_bukasegel}
            />

            <div className="pt-4 border-t-2 border-dashed border-gray-100 mt-4 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase">
                  Total Tagihan
                </p>
                <p className="text-xl font-black text-blue-600">
                  {formatRupiah(detail?.total || detail?.biaya_bukasegel)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 left-0 right-0 px-6 max-w-125 mx-auto">
        <button
          onClick={() => router.push(`/spk/${slug}/${id}/selesaikan`)}
          className="w-full bg-blue-600 text-white py-4 rounded-3xl font-black flex items-center justify-center gap-3 shadow-2xl shadow-blue-200 active:scale-95 transition-all"
        >
          <CheckSquare size={20} /> SELESAIKAN TUGAS SEKARANG
        </button>
      </div>

      {isImgOpen && (
        <div
          className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsImgOpen(false)}
        >
          <button className="absolute top-10 right-6 text-white bg-white/10 p-3 rounded-full">
            <X size={30} />
          </button>
          <div className="relative w-full h-[70vh]">
            <Image
              src={detail?.url_foto_aduan || ""}
              alt="Preview"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </div>
      )}
    </MobileContainer>
  );
}

function Badge({
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
    <span
      className={`${styles[color]} text-[10px] px-3 py-1 rounded-lg font-black border uppercase tracking-tight`}
    >
      {label}
    </span>
  );
}

function MiniInfo({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined | null;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] text-gray-400 font-bold uppercase">
        {label}
      </span>
      <span className="text-[11px] text-gray-800 font-bold truncate">
        {value || "-"}
      </span>
    </div>
  );
}

function InfoBox({ label, value, icon, className = "" }: InfoBoxProps) {
  return (
    <div
      className={`p-3 bg-gray-50 rounded-2xl border border-gray-100 ${className}`}
    >
      <div className="flex items-center gap-2 mb-1 text-gray-400">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-xs font-bold text-gray-800">
        {value || "Belum diisi"}
      </p>
    </div>
  );
}

function CostItem({ label, value, isDiscount = false }: CostItemProps) {
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
      <span
        className={`font-bold ${isDiscount ? "text-red-500" : "text-gray-800"}`}
      >
        {isDiscount && value && Number(value) !== 0 ? "- " : ""}
        {formatValue(value)}
      </span>
    </div>
  );
}
