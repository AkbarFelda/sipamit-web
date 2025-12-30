import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { spkService } from "@/core/services/spkService";
import { GenericSPKDetail } from "@/core/types/spk";

export function useSPKDetail(slug: string, id: string) {
  const [detail, setDetail] = useState<GenericSPKDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const token = Cookies.get("user_token") || "";
        const result = await spkService.getDetail(slug, id, token);
        setDetail(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    if (id && slug) fetchDetail();
  }, [id, slug]);

  return { detail, loading, error };
}