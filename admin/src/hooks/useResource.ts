import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/api';

interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

interface UseResourceOptions {
  limit?: number;
}

export function useResource<T extends Record<string, unknown>>(
  resourcePath: string,
  options: UseResourceOptions = {}
) {
  const limit = options.limit ?? 20;
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(
    async (p: number, q: string) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(p),
          limit: String(limit),
          ...(q ? { search: q } : {}),
        });
        const res = await api.get<ListResponse<T>>(
          `${resourcePath}?${params.toString()}`
        );
        setData(res.items);
        setTotal(res.total);
      } catch {
        // silently handle — could add toast here
      } finally {
        setLoading(false);
      }
    },
    [resourcePath, limit]
  );

  useEffect(() => {
    fetchData(page, search);
  }, [fetchData, page, search]);

  const handleSearch = (q: string) => {
    setSearch(q);
    setPage(1);
  };

  const refresh = () => fetchData(page, search);

  return {
    data,
    total,
    page,
    limit,
    loading,
    setPage,
    handleSearch,
    refresh,
  };
}
