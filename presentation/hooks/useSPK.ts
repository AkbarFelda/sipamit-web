import { useState, useEffect, useCallback } from "react";
import { spkService } from "@/core/services/spkService";
import Cookies from "js-cookie";
import { GenericSPKDetail } from "@/core/types/spk";

export const useSPK = (slug: string, tab: string) => {
  const [data, setData] = useState<GenericSPKDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = Cookies.get("user_token") || "";
  const fetchData = useCallback(async () => {
    if (!token || !slug) return;
    try {
      setLoading(true);
      setError(null);
      const status = tab === "Selesai" ? 1 : 0;
      const response = await spkService.getList(slug, status, token);
      
      setData(response);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Gagal mengambil data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [slug, tab, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};