import * as z from "zod";
import { isSlugValid } from "../utils";

export const productSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  slug: z
    .string()
    .min(1, {
      message: "Slug must be at least 1 characters.",
    })
    .refine((value) => isSlugValid(value)),
});

export const productVariantsSchema = z.array(
  z.object({
    variantSlug: z.string(),
    optionsSlug: z.string(),
  }),
);
