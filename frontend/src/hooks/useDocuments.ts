import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Paginated } from '@/types';

interface UseDocumentsOptions {
  endpoint: string;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export function useDocuments<T>({
  endpoint,
  search,
  status,
  page = 1,
  limit = 50,
}: UseDocumentsOptions) {
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Paginated<T>>(`/${endpoint}`, {
        params: {
          page,
          limit,
          search: search || undefined,
          status: status || undefined,
        },
      });
      setData(res.data.data);
      setTotal(res.data.total);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [endpoint, search, status, page, limit]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, total, loading, error, refetch: fetch };
}

export async function fetchOne<T>(endpoint: string, id: string): Promise<T> {
  const res = await api.get<T>(`/${endpoint}/${id}`);
  return res.data;
}

export async function deleteDocument(endpoint: string, id: string) {
  await api.delete(`/${endpoint}/${id}`);
}

export async function updateStatus(endpoint: string, id: string, status: string) {
  const res = await api.patch(`/${endpoint}/${id}/status`, { status });
  return res.data;
}
