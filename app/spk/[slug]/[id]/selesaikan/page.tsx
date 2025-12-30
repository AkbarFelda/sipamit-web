"use client";

import MobileContainer from "@/presentation/components/MobileContainer";
import HeaderPage from "@/presentation/components/HeaderPage";
import { useState, useRef, use } from "react";
import { Camera, Hash, PenTool, Trash2, CheckCircle } from "lucide-react";
import CameraView from "@/presentation/components/CameraView";
import ImagePickerSource from "@/presentation/components/ImagePickerSource";
import Input from "@/presentation/components/LoginPage/Input";
import SignatureCanvas from "react-signature-canvas";
import Image from "next/image";

export default function SelesaikanSPKPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const sigCanvas = useRef<SignatureCanvas>(null);
  
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [meterReading, setMeterReading] = useState("");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  // Fungsi Kompresi Sederhana
  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 800; canvas.height = 600;
        ctx?.drawImage(img, 0, 0, 800, 600);
        resolve(canvas.toDataURL("image/jpeg", 0.6));
      };
    });
  };

  const handleFinish = () => {
    if (!capturedImage || !meterReading || sigCanvas.current?.isEmpty()) {
      alert("Lengkapi Foto, Angka Meter, dan Tanda Tangan!");
      return;
    }
    const signature = sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png");
    console.log("Submit Data:", { id, capturedImage, meterReading, signature });
    alert("Laporan Berhasil Dikirim!");
  };

  return (
    <MobileContainer className="bg-gray-50 flex flex-col min-h-screen pb-10 text-black">
      <HeaderPage title="Form Penyelesaian" />

      <div className="p-6 space-y-6">
        {/* Step 1: Foto */}
        <div className="bg-white p-5 rounded-4xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Camera size={18} className="text-blue-600" /> Foto Bukti Kerja
          </h3>
          {capturedImage ? (
            <div className="relative">
              <Image src={capturedImage} alt="Bukti" width={400} height={300} unoptimized className="rounded-2xl w-full h-48 object-cover" />
              <button onClick={() => setCapturedImage(null)} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg">
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsPickerOpen(true)} className="w-full h-40 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400 gap-2 bg-gray-50">
              <Camera size={32} />
              <p className="text-xs font-bold">Ambil Foto Meteran</p>
            </button>
          )}
        </div>

        {/* Step 2: Angka Meter */}
        <div className="bg-white p-5 rounded-4xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Hash size={18} className="text-blue-600" /> Input Angka Meter
          </h3>
          <Input label="Stand Meter Terakhir" placeholder="0000" type="number" value={meterReading} onChange={setMeterReading} />
        </div>

        {/* Step 3: Tanda Tangan */}
        <div className="bg-white p-5 rounded-4xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <PenTool size={18} className="text-blue-600" /> Konfirmasi Pelanggan
          </h3>
          <div className="border border-gray-100 rounded-2xl bg-gray-50 overflow-hidden">
            <SignatureCanvas ref={sigCanvas} penColor="black" canvasProps={{ className: "w-full h-40" }} />
          </div>
          <button onClick={() => sigCanvas.current?.clear()} className="mt-2 text-xs text-red-500 font-bold">HAPUS TANDA TANGAN</button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleFinish}
          className="w-full bg-green-600 text-white py-4 rounded-3xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-green-100 active:scale-95 transition-all mt-4"
        >
          <CheckCircle size={20} /> KIRIM LAPORAN SEKARANG
        </button>
      </div>

      {/* Modals */}
      {isPickerOpen && (
        <ImagePickerSource
          onClose={() => setIsPickerOpen(false)}
          onCameraClick={() => { setIsPickerOpen(false); setShowCamera(true); }}
          onGalleryClick={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = async () => setCapturedImage(await compressImage(reader.result as string));
              reader.readAsDataURL(file);
              setIsPickerOpen(false);
            }
          }}
        />
      )}

      {showCamera && (
        <CameraView
          onCapture={async (src) => {
            setCapturedImage(await compressImage(src));
            setShowCamera(false);
          }}
          onClose={() => setShowCamera(false)}
        />
      )}
    </MobileContainer>
  );
}