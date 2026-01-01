"use client";

import { useState, use } from "react";
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
  Building2,
  Calendar,
  Drill,
  User,
  Signature,
  FileCheck,
  Boxes,
} from "lucide-react";
import Image from "next/image";
import { useSPKDetail } from "@/presentation/hooks/useSPKDetail";
import {
  Badge,
  MiniInfo,
  InfoBox,
  CostItem,
} from "@/presentation/components/DetailPage/DetailPage";

export default function DetailPelangganPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { id, slug } = use(params);
  const router = useRouter();
  const { detail, loading, error } = useSPKDetail(slug, id);
  const [isImgOpen, setIsImgOpen] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return "";
    return path.startsWith("http")
      ? path
      : `${process.env.NEXT_PUBLIC_API_URL}/${path}`;
  };

  const isDone = (() => {
    if (!detail) return false;
    const checkValue = (val: string | number | undefined | null) =>
      val === 1 || val === "1";

    switch (slug) {
      case "pasang-baru":
      case "pengaduan":
        return checkValue(detail.flagselesai);
      case "penyegelan":
        return checkValue(detail.flagproses);
      case "buka-segel":
        return checkValue(detail.flagbukasegel);
      case "pelayanan-lain":
        return checkValue(detail.flagproses);
      default:
        return false;
    }
  })();

  const formatRupiah = (amount: number | string | undefined | null) => {
    const value = typeof amount === "string" ? parseFloat(amount) : amount || 0;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handlePreview = (url: string | null | undefined) => {
    if (!url) return;
    setPreviewImg(getImageUrl(url));
    setIsImgOpen(true);
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
      <HeaderPage title={`Detail ${slug.replace(/-/g, " ").toWellFormed()}`} />

      <div className="p-6 space-y-6">
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
            <Badge
              label={isDone ? "SELESAI" : "TODO / PROSES"}
              color={isDone ? "green" : "orange"}
            />
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

        {isDone && (
          <div className="bg-green-50/20 p-5 rounded-4xl shadow-sm border border-green-200 space-y-4">
            <h3 className="font-bold text-green-800 flex items-center gap-2 text-sm">
              <FileCheck size={18} /> Bukti Penyelesaian Tugas
            </h3>
            <div className="p-3 bg-white rounded-2xl border border-green-100 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 p-2 rounded-lg text-green-600">
                  <Boxes size={16} />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase">
                  Merek Meter Terpasang
                </p>
              </div>
              <p className="font-black text-green-700">
                {detail?.merek_meter || "-"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1 italic">
                  <ImageIcon size={10} /> Foto{" "}
                  {slug === "buka-segel" ? "Buka" : "Proses"}
                </p>
                <div
                  className="relative w-full h-32 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 cursor-pointer shadow-inner"
                  onClick={() =>
                    handlePreview(
                      slug === "buka-segel"
                        ? detail?.url_foto_buka
                        : detail?.url_foto_proses
                    )
                  }
                >
                  {(
                    slug === "buka-segel"
                      ? detail?.url_foto_buka
                      : detail?.url_foto_proses
                  ) ? (
                    <Image
                      src={getImageUrl(
                        slug === "buka-segel"
                          ? detail?.url_foto_buka
                          : detail?.url_foto_proses
                      )}
                      alt="Bukti Kerja"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">
                      <ImageIcon size={24} />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1 italic">
                  <Signature size={10} /> Tanda Tangan
                </p>
                <div
                  className="relative w-full h-32 rounded-2xl overflow-hidden border border-gray-200 bg-white cursor-pointer shadow-inner"
                  onClick={() => {
                    const ttdPath =
                      slug === "buka-segel"
                        ? detail?.url_foto_ttd_buka
                        : slug === "penyegelan"
                        ? detail?.url_foto_ttd_proses
                        : detail?.url_foto_ttd; 
                    handlePreview(ttdPath);
                  }}
                >
                  {(
                    slug === "buka-segel"
                      ? detail?.url_foto_ttd_buka
                      : slug === "penyegelan"
                      ? detail?.url_foto_ttd_proses
                      : detail?.url_foto_ttd
                  ) ? (
                    <Image
                      src={getImageUrl(
                        slug === "buka-segel"
                          ? detail?.url_foto_ttd_buka
                          : slug === "penyegelan"
                          ? detail?.url_foto_ttd_proses
                          : detail?.url_foto_ttd
                      )}
                      alt="TTD"
                      fill
                      className="object-contain p-2"
                      unoptimized
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">
                      <Signature size={24} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {slug === "pengaduan" && detail?.url_foto_aduan && (
          <div className="bg-white p-5 rounded-4xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3 text-sm">
              <ImageIcon size={18} className="text-blue-600" /> Foto Lampiran
              SPK
            </h3>
            <div
              className="relative w-full h-48 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 cursor-pointer group shadow-inner"
              onClick={() => handlePreview(detail.url_foto_aduan)}
            >
              <Image
                src={getImageUrl(detail.url_foto_aduan)}
                alt="Lampiran"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <X className="text-white rotate-45" />
              </div>
            </div>
          </div>
        )}

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
                    `https://www.google.com/maps/search/?api=1&query=${detail?.latitude},${detail?.longitude}`,
                    "_blank"
                  )
                }
                className="mt-2 text-blue-600 font-black text-[10px] uppercase"
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
                Kontak Pelanggan
              </p>
              <p className="text-sm text-gray-800 font-bold">
                {detail?.no_hp || detail?.no_telp || "-"}
              </p>
              <button
                disabled={!detail?.no_hp}
                onClick={() => {
                  if (detail?.no_hp) {
                    window.location.href = `tel:${detail.no_hp}`;
                  }
                }}
                className="mt-2 text-blue-600 font-black text-[10px] uppercase"
              >
                Hubungi Sekarang
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-4xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-2 text-sm">
            <ClipboardList size={18} className="text-blue-600" /> Detail Teknis
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
              icon={<User size={14} />}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-4xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4 text-sm">
            <CreditCard size={18} className="text-blue-600" /> Rincian Biaya
          </h3>
          <div className="space-y-3">
            {slug === "pasang-baru" && (
              <>
                <CostItem
                  label="Biaya Peralatan"
                  value={detail?.biaya_peralatan}
                />
                <CostItem label="Biaya Survey" value={detail?.biaya_survey} />
                <CostItem label="Biaya Jasa Lainnya" value={detail?.biaya_jl} />
                <CostItem
                  label="Biaya Lain-lain"
                  value={detail?.biaya_lainnya}
                />
                <CostItem label="Ongkos Pasang" value={detail?.biaya_ongkos} />
                <CostItem label="Pajak (PPN)" value={detail?.ppn} />
                <CostItem label="Diskon" value={detail?.diskon} isDiscount />
              </>
            )}
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

      {!isDone && (
        <div className="fixed bottom-6 left-0 right-0 px-6 max-w-125 mx-auto">
          <button
            onClick={() => router.push(`/spk/${slug}/${id}/selesaikan`)}
            className="w-full bg-blue-600 text-white py-4 rounded-3xl font-black flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all"
          >
            <CheckSquare size={20} /> SELESAIKAN TUGAS SEKARANG
          </button>
        </div>
      )}

      {isImgOpen && previewImg && (
        <div
          className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsImgOpen(false)}
        >
          <button className="absolute top-10 right-6 text-white bg-white/10 p-3 rounded-full">
            <X size={30} />
          </button>
          <div className="relative w-full h-[70vh]">
            <Image
              src={previewImg}
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
