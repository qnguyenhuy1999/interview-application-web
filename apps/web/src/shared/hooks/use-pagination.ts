import { useState } from 'react';

interface UsePaginationOptions {
  pageSize?: number;
  total?: number;
}

export function usePagination({ pageSize = 10, total }: UsePaginationOptions = {}) {
  const [page, setPage] = useState(1);

  const totalPages = total !== undefined ? Math.ceil(total / pageSize) : undefined;
  const offset = (page - 1) * pageSize;

  return { page, setPage, totalPages, offset, pageSize };
}
