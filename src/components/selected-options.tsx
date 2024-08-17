"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { productVariantsSearchParamsSchema } from "~/lib/validations/search-params";
import { Badge } from "./ui/badge";
import { Cross2Icon, ResetIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";

export function SelectedOptions() {
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

  const spKeys = searchParams.keys();

  const variantToOptions = new Map<string, string[]>();

  for (const spKey of spKeys) {
    if (spKey in productVariantsSearchParamsSchema.shape) {
      const options = searchParams.get(spKey)?.split("|").filter(Boolean);
      if (options?.length) {
        variantToOptions.set(spKey, options);
      }
    }
  }

  const handleRemove = (variant: string, option: string) => {
    let options = variantToOptions.get(variant);
    options = options?.filter((o) => o != option);

    router.push(
      "?" +
        createQueryString({
          [variant]: options?.join("|") || null,
        }),
      { scroll: true },
    );
  };

  const reset = () => {
    router.push(
      "?" +
        createQueryString(
          Array.from(variantToOptions.keys()).reduce(
            (acc, key) => ({ ...acc, [key]: null }),
            {},
          ),
        ),
      { scroll: true },
    );
  };

  if (variantToOptions.size == 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {Array.from(variantToOptions).map(([variant, options]) =>
        options.map((option) => (
          <Button
            key={`${variant}-${option}`}
            size="sm"
            className="group flex items-center"
            onClick={() => handleRemove(variant, option)}
          >
            <Cross2Icon className="mr-1 size-3 group-hover:text-yellow-300 group-focus:text-yellow-300" />
            {option}
          </Button>
        )),
      )}
      {variantToOptions.size > 0 && (
        <Button size={"sm"} variant={"outline"} onClick={reset}>
          <ResetIcon className="mr-1 size-3" />
          Reset
        </Button>
      )}
    </div>
  );
}
