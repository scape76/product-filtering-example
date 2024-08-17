import * as z from "zod";
import { isSlugValid } from "../utils";

export const optionSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  slug: z
    .string()
    .min(1, {
      message: "Slug must be at least 1 characters.",
    })
    .refine((value) => isSlugValid(value)),
  variantSlug: z
    .string()
    .min(1, {
      message: "Variant slug must be at least 1 characters.",
    })
    .refine((value) => isSlugValid(value)),
});
