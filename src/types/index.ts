import { ProductVariant, ProductVariantOption } from "~/server/db/schema";

export type ProductVariantWithOptions = ProductVariant & {
  options: ProductVariantOption[];
};
