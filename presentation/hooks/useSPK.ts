// presentation/hooks/useSPK.ts
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { spkService } from "@/core/services/spkService";
import { GenericSPKDetail } from "@/core/types/spk"; // Gunakan interface list

export function useSPK(slug: string, activeTab: string) {
  const [data, setData] = useState<GenericSPKDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = Cookies.get("user_token") || "";
        
        // Konversi string Tab "Selesai" -> 1, selain itu -> 0
        const statusValue = activeTab === "Selesai" ? 1 : 0;
        
        // Pastikan urutan parameter di Service: (slug, status, token)
        const result = await spkService.getList(slug, statusValue, token);

        setData(Array.isArray(result) ? result : []);
        setError(null);
      } catch (err) {
        setData([]); 
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug, activeTab]);

  return { data, loading, error };
}