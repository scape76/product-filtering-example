"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Pagination } from "./pagination";

interface ProductsPaginationProps {
  pageCount: number;
}

export function ProductsPagination({ pageCount }: ProductsPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams],
  );

  const page = Number(searchParams.get("page")) ?? 1;
  const fallbackPage = isNaN(page) || page < 1 ? 1 : page;

  const onPageChange = useCallback(
    (page: string | number) => {
      router.push(pathname + "?" + createQueryString({ page }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, pathname, searchParams],
  );

  return (
    <Pagination
      boundaries={1}
      siblings={1}
      onPageChange={onPageChange}
      page={fallbackPage}
      pageCount={pageCount}
    />
  );
}
