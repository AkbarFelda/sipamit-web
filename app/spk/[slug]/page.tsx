"use client";
import MobileContainer from "@/presentation/components/MobileContainer";
import HeaderPage from "@/presentation/components/HeaderPage";
import { useParams, useRouter } from "next/navigation";
import { User, MapPin, Calendar } from "lucide-react";

export default function SPKDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";
  const title = slug ? slug.replace(/-/g, " ").toUpperCase() : "DETAIL DATA";

  const pelangganList = [
    {
      id: "101",
      nama: "Rudolf Santoso",
      alamat: "Jl. Magelang KM 12",
      tgl: "26 Des 2025",
      status: "Sedang Diproses",
    },
    {
      id: "102",
      nama: "Syra Alaxandra",
      alamat: "Perum Sleman Permai",
      tgl: "27 Des 2025",
      status: "Selesai",
    },
    {
      id: "103",
      nama: "Dewi Lestari",
      alamat: "Depok, Sleman",
      tgl: "28 Des 2025",
      status: "Menunggu",
    },
  ];

  return (
    <MobileContainer className="bg-linear-to-b from-blue-top to-blue-bottom">
      <HeaderPage title={title} />

      <div className="p-6 flex flex-col gap-4">
        {pelangganList.map((pelanggan) => (
          <div
            key={pelanggan.id}
            className="bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-sm border border-white/20"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <User size={20} />
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  pelanggan.status === "Selesai"
                    ? "bg-green-100 text-green-600"
                    : "bg-amber-100 text-amber-600"
                }`}
              >
                {pelanggan.status}
              </span>
            </div>

            <h3 className="font-bold text-gray-800 text-lg">
              {pelanggan.nama}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
              <MapPin size={14} /> {pelanggan.alamat}
            </p>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar size={14} /> {pelanggan.tgl}
              </div>

              <button
                onClick={() => router.push(`/spk/${slug}/${pelanggan.id}`)}
                className="text-sm font-bold text-blue-600 hover:underline active:opacity-50"
              >
                Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>
    </MobileContainer>
  );
}
