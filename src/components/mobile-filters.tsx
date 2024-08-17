"use client";

import { Drawer } from "vaul";
import { Button } from "./ui/button";
import { ProductFilters } from "./product-filters";
import { ProductVariantWithOptions } from "~/types";
import { VariantBlock } from "./variant-block";

import { useMediaQuery } from "usehooks-ts";
import { Icons } from "./icons";

interface MobileFiltersProps {
  variants: ProductVariantWithOptions[];
}

export function MobileFilters({ variants }: MobileFiltersProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) return null;

  return (
    <Drawer.Root direction="right">
      <Drawer.Trigger asChild>
        <Button className="w-fit" variant="outline">
          <Icons.filter className="mr-2 size-4" />
          Filters
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 right-0 mt-24 flex h-full w-[80vw] flex-col rounded-t-[10px] bg-white">
          <div className="h-full flex-1 bg-white p-4">
            {variants.map((variant) => (
              <VariantBlock variant={variant} key={variant.slug} />
            ))}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
