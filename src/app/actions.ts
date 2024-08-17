"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z, ZodError } from "zod";
import { optionSchema } from "~/lib/validations/option";
import { variantSchema } from "~/lib/validations/variant";
import { productSchema } from "~/lib/validations/product";
import { db } from "~/server/db";
import {
  products,
  productVariantOptions,
  productVariants,
} from "~/server/db/schema";

export async function createProductVariant(
  values: z.infer<typeof variantSchema>,
) {
  try {
    const validated = variantSchema.parse(values);

    const candidate = await getProductVariantBySlug(validated.slug);

    if (candidate) {
      return {
        error: `Product variant with slug ${validated.slug} already exists.`,
      };
    }

    await db.insert(productVariants).values({
      title: validated.title,
      slug: validated.slug,
    });

    revalidatePath("/");
  } catch (err) {
    return {
      error: getErrorMessage(err),
    };
  }
}

export async function createProductVariantOption(
  values: z.infer<typeof optionSchema>,
) {
  try {
    const validated = optionSchema.parse(values);

    const candidate = await db.query.productVariantOptions.findFirst({
      where: eq(productVariantOptions.slug, validated.slug),
    });

    if (candidate) {
      return {
        error: `Product variant option with slug ${validated.slug} already exists.`,
      };
    }

    const productVariant = getProductVariantBySlug(validated.slug);

    if (!productVariant) {
      return {
        error: `Product variant with slug ${validated.slug} doesn't exist.`,
      };
    }

    await db.insert(productVariantOptions).values({
      title: validated.title,
      slug: validated.slug,
      variantSlug: validated.variantSlug,
    });

    revalidatePath("/");
  } catch (err) {
    return {
      error: getErrorMessage(err),
    };
  }
}

export async function createProduct(values: z.infer<typeof productSchema>) {
  try {
    const validated = productSchema.parse(values);

    const candidate = await db.query.products.findFirst({
      where: eq(products.slug, validated.slug),
    });

    if (candidate) {
      return {
        error: `Product with slug ${validated.slug} already exists.`,
      };
    }

    await db.insert(products).values({
      name: validated.name,
      slug: validated.slug,
    });

    revalidatePath("/");
  } catch (err) {
    return {
      error: getErrorMessage(err),
    };
  }
}

function getProductVariantBySlug(slug: string) {
  return db.query.productVariants.findFirst({
    where: eq(productVariants.slug, slug),
  });
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  } else if (err instanceof ZodError) {
    return err.errors.reduce((acc, err) => acc + err.message + "\n", "");
  }

  return "Something went wrong, please, try again later";
}
