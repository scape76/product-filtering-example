"use server";

import { db } from "~/server/db";
import { GetProducts } from "~/lib/validations/search-params";
import {
  products,
  productsToProductVariants,
  productVariantOptions,
  productVariants,
} from "~/server/db/schema";
import { and, eq, ilike, inArray, or, sql, count } from "drizzle-orm";

export async function getAllProductVariants() {
  return db.query.productVariants.findMany({
    with: { options: true },
  });
}

const variantFilters = (
  name: string,
  searchedOptions: string[] | undefined,
  filtersCount: {
    count: number;
  },
) => {
  if (searchedOptions) {
    filtersCount.count++;
    return and(
      eq(productsToProductVariants.productVariantSlug, name),
      inArray(
        productsToProductVariants.productVariantOptionSlug,
        searchedOptions,
      ),
    );
  }

  return undefined;
};

export async function getFilteredProducts(input: GetProducts) {
  try {
    const { brand, color, size, gender, material, type, name } = input;

    const transaction = await db.transaction(async (tx) => {
      let filtersCount = {
        count: 0,
      };

      const filters = and(
        or(
          variantFilters("brand", brand, filtersCount),
          variantFilters("color", color, filtersCount),
          variantFilters("size", size, filtersCount),
          variantFilters("gender", gender, filtersCount),
          variantFilters("material", material, filtersCount),
          variantFilters("type", type, filtersCount),
        ),
        name ? ilike(products.name, `%${name}%`) : undefined,
      );

      const data = await tx
        .select({
          slug: products.slug,
          name: products.name,
          image: products.image,
        })
        .from(productsToProductVariants)
        .innerJoin(
          products,
          eq(productsToProductVariants.productSlug, products.slug),
        )
        .where(filters)
        .having(sql`count(${products.slug}) >= ${filtersCount.count}`)
        .limit(input.limit)
        .offset(input.offset)
        .groupBy(products.slug);

      const count = await tx
        .select({
          row: sql`count(${productsToProductVariants.productSlug})`,
        })
        .from(productsToProductVariants)
        .innerJoin(
          products,
          eq(productsToProductVariants.productSlug, products.slug),
        )
        .where(filters)
        .having(sql`count(${products.slug}) >= ${filtersCount.count}`)
        .groupBy(products.slug)
        .execute()
        .then((result) => result.length);

      const pageCount = Math.ceil(count / input.limit);

      return { data, pageCount };
    });

    return transaction;
  } catch (err) {
    return {
      err: err,
      data: [],
      pageCount: 0,
    };
  }
}
