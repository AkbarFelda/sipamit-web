"use client";

import MobileContainer from "@/presentation/components/MobileContainer";
import HeaderPage from "@/presentation/components/HeaderPage";
import { use, useState } from "react";
import { User, MapPin, Phone, ClipboardList, Navigation, CheckSquare, Image as ImageIcon, X, ZoomIn } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DetailPelangganPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { id, slug } = use(params);
  const router = useRouter();
  
  // State untuk Modal Viewer Gambar
  const [isImgOpen, setIsImgOpen] = useState(false);

  const detail = {
    nama: "Rudolf Santoso",
    noMeter: "882910223",
    alamat: "Jl. Magelang KM 12, No. 45, Sleman, DIY",
    noHp: "08123456789",
    tipe: "Rumah Tangga A1",
    instruksi: "Pasang meteran di sisi kiri pagar depan rumah.",
    latlong: "-7.716,110.364",
    imageUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=1000" // Contoh URL foto SPK/Instruksi
  };

  return (
    <MobileContainer className="bg-gray-50 flex flex-col min-h-screen pb-24 text-black">
      <HeaderPage title="Detail Pelanggan" />

      <div className="p-6 space-y-6">
        {/* Identitas Utama */}
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg shadow-blue-100">
            RS
          </div>
          <h2 className="text-xl font-bold text-gray-800">{detail.nama}</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">ID Pelanggan: {id}</p>
        </div>

        {/* SEKSI: Lihat Foto Lampiran / SPK */}
        <div className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
            <ImageIcon size={18} className="text-blue-600" /> Foto Lampiran SPK
          </h3>
          <div 
            className="relative w-full h-32 rounded-2xl overflow-hidden border border-gray-100 cursor-pointer group"
            onClick={() => setIsImgOpen(true)}
          >
            <Image 
              src={detail.imageUrl} 
              alt="Lampiran SPK" 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg">
                <ZoomIn size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="absolute bottom-2 right-3">
              <p className="text-[10px] text-white font-bold drop-shadow-md">Klik untuk perbesar</p>
            </div>
          </div>
        </div>

        {/* Info Kontak & Lokasi */}
        <div className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-green-50 p-3 rounded-2xl text-green-600">
              <MapPin size={22} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Alamat Lokasi</p>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">{detail.alamat}</p>
              <button 
                onClick={() => window.open(`https://www.google.com/maps?q=${detail.latlong}`, "_blank")}
                className="mt-2 flex items-center gap-2 text-blue-600 font-bold text-xs"
              >
                <Navigation size={14} /> LIHAT DI GOOGLE MAPS
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
              <Phone size={22} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Nomor Telepon</p>
              <p className="text-sm text-gray-700 font-medium">{detail.noHp}</p>
              <button 
                onClick={() => window.open(`tel:${detail.noHp}`, "_self")}
                className="mt-1 text-blue-600 font-bold text-xs"
              >
                HUBUNGI PELANGGAN
              </button>
            </div>
          </div>
        </div>

        {/* Detail Teknis */}
        <div className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
            <ClipboardList size={18} className="text-blue-600" /> Informasi Teknis
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase">No. Meter</p>
              <p className="text-sm font-bold text-gray-700">{detail.noMeter}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Tipe</p>
              <p className="text-sm font-bold text-gray-700">{detail.tipe}</p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL IMAGE VIEWER (FULLSCREEN) */}
      {isImgOpen && (
        <div 
          className="fixed inset-0 z-[99] bg-black/90 flex flex-col items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setIsImgOpen(false)}
        >
          <button className="absolute top-10 right-6 text-white p-2 bg-white/10 rounded-full">
            <X size={24} />
          </button>
          <div className="relative w-full h-[70vh]">
            <Image 
              src={detail.imageUrl} 
              alt="Preview SPK" 
              fill 
              className="object-contain" 
              unoptimized 
            />
          </div>
          <p className="text-white text-sm mt-4 font-medium italic">Sentuh di mana saja untuk kembali</p>
        </div>
      )}

      {/* Floating Button */}
      <div className="fixed bottom-6 left-0 right-0 px-6 max-w-[500px] mx-auto">
        <button
          onClick={() => router.push(`/spk/${slug}/${id}/selesaikan`)}
          className="w-full bg-blue-600 text-white py-4 rounded-[24px] font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-200 active:scale-95 transition-all"
        >
          <CheckSquare size={20} />
          PROSES PENYELESAIAN
        </button>
      </div>
    </MobileContainer>
  );
}