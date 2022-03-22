import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

const PAGE_SIZE = 10;

interface UsePagination<T> {
  paginatedData: T[];
  pages: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}

export const usePagination = <T extends Record<string, unknown>>({
  data,
  tab,
}: {
  data: T[];
  tab: string;
}): UsePagination<T> => {
  const pages = Math.ceil(data.length / PAGE_SIZE);
  const [page, setPage] = useState(0);
  const offset = page * PAGE_SIZE;
  const paginatedData = data.slice(offset, offset + PAGE_SIZE);

  // Reset page when changing tab.
  useEffect(() => {
    setPage(0);
  }, [tab]);

  return { paginatedData, pages, page, setPage };
};
