"use client";

import { ProductVariant, ProductVariantOption } from "~/server/db/schema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { ProductVariantWithOptions } from "~/types";
import { Checkbox } from "./ui/checkbox";
import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AddOptionDialog } from "./add-option-dialog";
import { Label } from "./ui/label";

export function VariantBlock({
  variant,
}: {
  variant: ProductVariantWithOptions;
}) {
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

  const selectedVariantOptions = searchParams.get(variant.slug)?.split("|");

  const onCheckedChange = (optionSlug: string, value: boolean) => {
    let newOptions = selectedVariantOptions || [];

    if (value) {
      newOptions.push(optionSlug);
    } else {
      newOptions = newOptions.filter((slug) => slug != optionSlug);
    }

    const qs = createQueryString({
      [variant.slug]: newOptions.join("|"),
    });

    router.push("?" + qs, { scroll: true });
  };

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>{variant.title}</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-wrap gap-2 px-2">
            {variant.options.map((option) => (
              <div className="flex items-center gap-2" key={option.slug}>
                <Checkbox
                  id={`option-${option.slug}`}
                  checked={
                    searchParams.has(variant.slug) &&
                    selectedVariantOptions?.includes(option.slug)
                  }
                  onCheckedChange={(value) => {
                    onCheckedChange(option.slug, Boolean(value));
                  }}
                />
                <Label htmlFor={`option-${option.slug}`}>{option.title}</Label>
              </div>
            ))}
          </div>
          {/* <AddOptionDialog variant={variant} /> */}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
