"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useDebounceValue } from "usehooks-ts";

import { Input } from "~/components/ui/input";

export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState<string>(searchParams.get("query") ?? "");

  const [debouncedValue] = useDebounceValue(value, 500);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const newQueryString = createQueryString({
      page: 1,
      name: debouncedValue,
    });

    startTransition(() => {
      router.push(`${pathname}?${newQueryString}`, {
        scroll: false,
      });
    });
  }, [debouncedValue]);

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

  return (
    <Input
      type="search"
      placeholder="Search products..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
    />
  );
}
