import { useState, useEffect, useCallback } from "react";
import { spkService } from "@/core/services/spkService";
import Cookies from "js-cookie";
import { GenericSPKDetail } from "@/core/types/spk";

export const useSPK = (slug: string, activeTab: string) => {
  const [data, setData] = useState<GenericSPKDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = useCallback(async (pageNum: number, isRefetch: boolean = false) => {
    setLoading(true);
    try {
      const status = activeTab === "Sedang Diproses" ? 0 : 1;
      const token = Cookies.get("user_token") || "";
      
      const newData = await spkService.getList(slug, status, token, pageNum);

      if (isRefetch) {
        setData(newData);
        setHasMore(newData.length === 10);
      } else {
        setData((prev) => [...prev, ...newData]);
        if (newData.length < 10) {
          setHasMore(false);
        }
      }
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [slug, activeTab]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchData(1, true);
  }, [slug, activeTab, fetchData]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage);
    }
  };

  const refetch = () => {
    setPage(1);
    setHasMore(true);
    fetchData(1, true);
  };

  return { 
    data, 
    loading, 
    error, 
    hasMore, 
    fetchData, 
    loadMore: () => {
      if (!loading && hasMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchData(nextPage);
      }
    }, 
    refetch: () => fetchData(1, true) 
  };
};