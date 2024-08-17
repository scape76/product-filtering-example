import { ProductVariantWithOptions } from "~/types";
import { VariantBlock } from "./variant-block";
import { ScrollArea } from "./ui/scroll-area";

interface ProductFiltersProps {
  variants: ProductVariantWithOptions[];
}

export function ProductFilters({ variants }: ProductFiltersProps) {
  return (
    <div>
      {variants.map((variant) => (
        <VariantBlock variant={variant} key={variant.slug} />
      ))}
    </div>
  );
}
