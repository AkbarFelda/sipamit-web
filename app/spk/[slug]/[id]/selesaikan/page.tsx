"use client";

import MobileContainer from "@/presentation/components/MobileContainer";
import HeaderPage from "@/presentation/components/HeaderPage";
import { useState, useRef, use, useEffect } from "react";
import { Camera, Hash, PenTool, Trash2, CheckCircle, Boxes, ClipboardEdit, ClipboardCheck } from "lucide-react";
import CameraView from "@/presentation/components/CameraView";
import ImagePickerSource from "@/presentation/components/ImagePickerSource";
import LoadingOverlay from "@/presentation/components/LoadingOverlay";
import SignatureCanvas from "react-signature-canvas";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { spkService } from "@/core/services/spkService";
import { MerekMeter } from "@/core/types/merekmeter";

interface JenisPenyelesaian {
  id: number;
  nama_penyelesaian: string;
}

export default function SelesaikanSPKPage({ params }: { params: Promise<{ id: string; slug: string }> }) {
  const { id, slug } = use(params);
  const router = useRouter();
  const sigCanvas = useRef<SignatureCanvas>(null);

  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [meterReading, setMeterReading] = useState("");
  const [keterangan, setKeterangan] = useState("");
  
  // States untuk Dropdowns
  const [listMerek, setListMerek] = useState<MerekMeter[]>([]);
  const [selectedMerekId, setSelectedMerekId] = useState("");
  const [listJenisPenyelesaian, setListJenisPenyelesaian] = useState<JenisPenyelesaian[]>([]);
  const [selectedJenisPenyelesaianId, setSelectedJenisPenyelesaianId] = useState("");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  // Fetch Data Dropdown berdasarkan Kategori (Slug)
  useEffect(() => {
    const token = Cookies.get("user_token") || "";
    
    if (slug === "pasang-baru") {
      const fetchMerek = async () => {
        try {
          const result = await spkService.getMerekMeter(token);
          const data = Array.isArray(result) ? result : result.data;
          setListMerek(data || []);
          if (data && data.length > 0) setSelectedMerekId(data[0].id.toString());
        } catch (err) { console.error("Gagal load merek:", err); }
      };
      fetchMerek();
    }

    if (slug === "pengaduan") {
      const fetchJenisPenyelesaian = async () => {
        try {
          const result = await spkService.getJenisPenyelesaian(token);
          const data = Array.isArray(result) ? result : result.data;
          setListJenisPenyelesaian(data || []);
          if (data && data.length > 0) setSelectedJenisPenyelesaianId(data[0].id.toString());
        } catch (err) { console.error("Gagal load jenis penyelesaian:", err); }
      };
      fetchJenisPenyelesaian();
    }
  }, [slug]);

  const base64ToFile = (base64: string, filename: string) => {
    const arr = base64.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

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

  const handleFinish = async () => {
    if (!capturedImage || sigCanvas.current?.isEmpty()) {
      alert("Harap lengkapi Foto Bukti dan Tanda Tangan!");
      return;
    }

    try {
      setLoading(true);
      const token = Cookies.get("user_token") || "";
      const formData = new FormData();
      formData.append("id", id);

      if (slug === "pasang-baru") {
        formData.append("merek_id", selectedMerekId);
        formData.append("nometer", meterReading);
        formData.append("foto_proses", base64ToFile(capturedImage, "foto_proses.jpg"));
      } 
      else if (slug === "pengaduan") {
        formData.append("ket_penyelesaian", keterangan);
        formData.append("jenis_penyelesaian_id", selectedJenisPenyelesaianId);
        formData.append("foto_penyelesaian", base64ToFile(capturedImage, "foto_penyelesaian.jpg"));
      } 
      else if (slug === "penyegelan" || slug === "buka-segel") {
        formData.append("foto_proses", base64ToFile(capturedImage, "foto_proses.jpg"));
        if (slug === "buka-segel") formData.append("stan_meter", meterReading);
      }

      const canvas = sigCanvas.current?.getTrimmedCanvas();
      if (canvas) {
        formData.append("foto_ttd", base64ToFile(canvas.toDataURL("image/jpg"), "foto_ttd.jpg"));
      }

      await spkService.submitProses(slug, formData, token);
      alert("Laporan Berhasil Dikirim!");
      router.push("/");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      alert("Gagal mengirim: " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileContainer className="bg-gray-50 flex flex-col min-h-screen pb-10 text-black">
      {loading && <LoadingOverlay message="Sedang memproses laporan..." />}
      <HeaderPage title={`Selesaikan ${slug.replace("-", " ").toUpperCase()}`} />

      <div className="p-6 space-y-6">
        
        {/* 1. DROPDOWNS (Merek atau Jenis Penyelesaian) */}
        {slug === "pasang-baru" && (
          <div className="bg-white p-5 rounded-4xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm">
              <Boxes size={18} className="text-blue-600" /> Pilih Merek Meter
            </h3>
            <select
              value={selectedMerekId}
              onChange={(e) => setSelectedMerekId(e.target.value)}
              className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-sm text-black outline-none appearance-none"
            >
              {listMerek.map((m) => (
                <option key={m.id} value={m.id}>{m.nama.trim()}</option>
              ))}
            </select>
          </div>
        )}

        {slug === "pengaduan" && (
          <div className="bg-white p-5 rounded-4xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm">
              <ClipboardCheck size={18} className="text-blue-600" /> Pilih Jenis Penyelesaian
            </h3>
            <select
              value={selectedJenisPenyelesaianId}
              onChange={(e) => setSelectedJenisPenyelesaianId(e.target.value)}
              className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-sm text-black outline-none appearance-none"
            >
              <option value="" disabled>-- Pilih Jenis --</option>
              {listJenisPenyelesaian.map((jp) => (
                <option key={jp.id} value={jp.id}>{jp.nama_penyelesaian?.trim() || ""}</option>
              ))}
            </select>
          </div>
        )}

        {/* 2. Keterangan (Hanya Pengaduan) */}
        {slug === "pengaduan" && (
          <div className="bg-white p-5 rounded-4xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm">
              <ClipboardEdit size={18} className="text-blue-600" /> Keterangan Tambahan
            </h3>
            <textarea
              className="w-full p-4 bg-gray-50 rounded-2xl text-sm outline-none min-h-24 text-black"
              placeholder="Masukkan detail pekerjaan..."
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
            />
          </div>
        )}

        {/* 3. Input Foto */}
        <div className="bg-white p-5 rounded-4xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm">
            <Camera size={18} className="text-blue-600" /> 
            {slug === "pengaduan" ? "Foto Penyelesaian" : "Foto Bukti Kerja"}
          </h3>
          {capturedImage ? (
            <div className="relative group">
              <Image src={capturedImage} alt="Bukti" width={400} height={300} unoptimized className="rounded-2xl w-full h-48 object-cover shadow-inner" />
              <button onClick={() => setCapturedImage(null)} className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full shadow-lg"><Trash2 size={16} /></button>
            </div>
          ) : (
            <button onClick={() => setIsPickerOpen(true)} className="w-full h-40 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400 gap-2 bg-gray-50 active:bg-gray-100 transition-colors">
              <Camera size={28} />
              <p className="text-xs font-bold uppercase tracking-tighter">Ambil Foto Bukti</p>
            </button>
          )}
        </div>

        {/* 4. Stan/Nomor Meter (PSB & Buka Segel) */}
        {(slug === "pasang-baru" || slug === "buka-segel") && (
          <div className="bg-white p-5 rounded-4xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm">
              <Hash size={18} className="text-blue-600" /> 
              {slug === "pasang-baru" ? "Nomor Meter Baru" : "Angka Stan Meter"}
            </h3>
            <input
              type="number"
              className="w-full p-4 bg-gray-50 rounded-2xl font-black text-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
              placeholder="0"
              value={meterReading}
              onChange={(e) => setMeterReading(e.target.value)}
            />
          </div>
        )}

        {/* 5. Tanda Tangan */}
        <div className="bg-white p-5 rounded-4xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
              <PenTool size={18} className="text-blue-600" /> Konfirmasi Pelanggan
            </h3>
            <button onClick={() => sigCanvas.current?.clear()} className="text-[10px] text-red-500 font-black uppercase border-b border-red-500">Hapus</button>
          </div>
          <div className="border border-gray-100 rounded-2xl bg-gray-50 overflow-hidden shadow-inner">
            <SignatureCanvas ref={sigCanvas} penColor="black" canvasProps={{ className: "w-full h-40 cursor-crosshair" }} />
          </div>
        </div>

        <button
          onClick={handleFinish}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all mt-4 mb-10 disabled:bg-gray-300"
        >
          <CheckCircle size={22} /> SIMPAN & KIRIM LAPORAN
        </button>
      </div>

      {/* MODALS */}
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