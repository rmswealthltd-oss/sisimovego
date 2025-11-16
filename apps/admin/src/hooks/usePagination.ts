import { useState, useMemo } from "react";

export type UsePaginationOptions = {
  initialPage?: number;
  initialLimit?: number;
  initialSortBy?: string;
  initialSortDir?: "asc" | "desc";
};

export function usePagination(opts?: UsePaginationOptions) {
  const [page, setPage] = useState<number>(opts?.initialPage ?? 1);
  const [limit, setLimit] = useState<number>(opts?.initialLimit ?? 20);
  const [sortBy, setSortBy] = useState<string | null>(opts?.initialSortBy ?? null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(opts?.initialSortDir ?? "desc");
  const [total, setTotal] = useState<number>(0);

  const offset = useMemo(() => (page - 1) * limit, [page, limit]);

  function reset() {
    setPage(1);
    setSortBy(opts?.initialSortBy ?? null);
    setSortDir(opts?.initialSortDir ?? "desc");
  }

  function next() {
    setPage((p) => p + 1);
  }

  function prev() {
    setPage((p) => Math.max(1, p - 1));
  }

  function setFromServer(meta?: { total?: number; page?: number }) {
    if (!meta) return;
    if (typeof meta.total === "number") setTotal(meta.total);
    if (typeof meta.page === "number") setPage(meta.page);
  }

  return {
    page,
    setPage,
    limit,
    setLimit,
    offset,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
    total,
    setTotal,
    reset,
    next,
    prev,
    setFromServer
  };
}
