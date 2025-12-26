"use client";

import MobileContainer from "@/presentation/components/MobileContainer";
import HeaderPage from "@/presentation/components/HeaderPage";
import { use, useState } from "react";
import { User, MapPin, Phone, ClipboardList, Camera, Hash } from "lucide-react";
import CameraView from "@/presentation/components/CameraView";
import ImagePickerSource from "@/presentation/components/ImagePickerSource";
import Image from "next/image";
import Input from "@/presentation/components/LoginPage/Input"; 
import { Button } from "@/presentation/components/LoginPage/Button";

export default function DetailPelangganPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { id } = use(params);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [meterReading, setMeterReading] = useState("");

  const detailPelanggan = {
    id: id,
    nama: "Rudolf Santoso",
    noMeter: "882910223",
    alamat: "Jl. Magelang KM 12, No. 45, Sleman, DIY",
    noHp: "0812-3456-7890",
    tipe: "Rumah Tangga A1",
    instruksi: "Pasang meteran di sisi kiri pagar depan rumah.",
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        setIsPickerOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!capturedImage || !meterReading) {
      alert("Mohon lengkapi foto dan angka meteran!");
      return;
    }
    console.log("Data dikirim:", { id, capturedImage, meterReading });
    alert("Data berhasil disimpan!");
  };

  return (
    <MobileContainer className="bg-gray-50 flex flex-col pb-10">
      <HeaderPage title="Detail Pelanggan" />

      <div className="p-6 space-y-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
              <User size={24} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-800">
                {detailPelanggan.nama}
              </h2>
              <p className="text-sm text-gray-500">ID: {detailPelanggan.id}</p>
            </div>
          </div>
          <div className="space-y-3 pt-3 border-t border-gray-50">
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <MapPin size={18} className="text-gray-400 shrink-0" />
              <p>{detailPelanggan.alamat}</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Phone size={18} className="text-gray-400 shrink-0" />
              <p>{detailPelanggan.noHp}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ClipboardList size={18} className="text-blue-600" />
            Informasi Teknis
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-gray-50 rounded-2xl">
              <p className="text-[10px] uppercase text-gray-400 font-bold">
                No. Meter
              </p>
              <p className="text-sm font-bold text-gray-700">
                {detailPelanggan.noMeter}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-2xl">
              <p className="text-[10px] uppercase text-gray-400 font-bold">
                Tipe
              </p>
              <p className="text-sm font-bold text-gray-700">
                {detailPelanggan.tipe}
              </p>
            </div>
          </div>
          <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100">
            <p className="text-[10px] uppercase text-blue-400 font-bold">
              Instruksi Kerja
            </p>
            <p className="text-sm text-blue-800 italic mt-1 leading-relaxed">
              {detailPelanggan.instruksi}
            </p>
          </div>
        </div>

        {capturedImage ? (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="bg-white p-2 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <Image
                src={capturedImage}
                alt="Hasil Scan"
                width={500}
                height={300}
                unoptimized
                className="w-full h-48 object-cover rounded-2xl"
              />
              <div className="flex justify-between items-center p-3">
                <p className="text-xs text-green-600 font-bold">
                  Foto Berhasil Diambil ✅
                </p>
                <button
                  onClick={() => setIsPickerOpen(true)}
                  className="text-xs text-blue-600 font-bold underline"
                >
                  Ganti Foto
                </button>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Hash size={18} className="text-blue-600" />
                <h3 className="font-bold text-gray-800">Input Angka Meter</h3>
              </div>
              <Input
                label="Angka Meteran Saat Ini"
                placeholder="Contoh: 12345"
                type="number"
                value={meterReading}
                onChange={setMeterReading}
              />
              <div className="mt-6">
                <Button label="Simpan Laporan" onClick={handleSubmit} />
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-4">
            <button
              onClick={() => setIsPickerOpen(true)}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 active:scale-95 transition-all"
            >
              <Camera size={20} />
              Mulai Ambil Foto / Scan
            </button>
          </div>
        )}
      </div>

      {isPickerOpen && (
        <ImagePickerSource
          onClose={() => setIsPickerOpen(false)}
          onCameraClick={() => {
            setIsPickerOpen(false);
            setShowCamera(true);
          }}
          onGalleryClick={handleGalleryUpload}
        />
      )}

      {showCamera && (
        <CameraView
          onCapture={(src) => {
            setCapturedImage(src);
            setShowCamera(false);
          }}
          onClose={() => setShowCamera(false)}
        />
      )}
    </MobileContainer>
  );
}
