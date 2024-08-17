// this file is generated via script.
// see scripts/create-product-params-validation.ts
import * as z from "zod";

export const productVariantsSearchParamsSchema = z.object({
  brand: z.string().optional(),
  size: z.string().optional(),
  type: z.string().optional(),
  color: z.string().optional(),
  gender: z.string().optional(),
  material: z.string().optional(),
});

export const productSearchParamsSchema =
  productVariantsSearchParamsSchema.extend({
    page: z.coerce.number().default(1),
    name: z.string().optional(),
  });

export const getProductsSchema = z.object({
  brand: z.array(z.string()).optional(),
  size: z.array(z.string()).optional(),
  type: z.array(z.string()).optional(),
  color: z.array(z.string()).optional(),
  gender: z.array(z.string()).optional(),
  material: z.array(z.string()).optional(),
  limit: z.number(),
  offset: z.number(),
  name: z.string().optional(),
});

export type ProductSearchParams = z.infer<typeof productSearchParamsSchema>;
export type GetProducts = z.infer<typeof getProductsSchema>;
