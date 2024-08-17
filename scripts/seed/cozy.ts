import { db } from "~/server/db";
import {
  products,
  productsToProductVariants,
  productVariantOptions,
  productVariants,
} from "~/server/db/schema";
import cozyVariants from "./product-variants.json";
import cozyProducts from "./products.json";
import "../console";

async function seed() {
  console.info("Running seed...");
  const start = Date.now();
  // cleanup

  await db.delete(products);
  await db.delete(productsToProductVariants);
  await db.delete(productVariantOptions);
  await db.delete(productVariants);

  // seed
  await seedProductVariants();
  await seedProducts();

  const end = Date.now();

  console.success(`Seed completed in ${end - start}ms`);

  process.exit(0);
}

async function seedProductVariants() {
  await Promise.all(
    cozyVariants.map(async (variant) => {
      await db.insert(productVariants).values({
        slug: variant.slug,
        title: variant.title,
      });

      await db.insert(productVariantOptions).values(
        variant.options.map((option) => ({
          ...option,
          variantSlug: variant.slug,
        })),
      );
    }),
  );
}

async function seedProducts() {
  await Promise.all(
    cozyProducts.map(async (product) => {
      await db.insert(products).values({
        slug: product.slug,
        name: product.name,
        image: product.image,
      });

      await db.insert(productsToProductVariants).values(
        product.variants.map((variant) => ({
          productSlug: product.slug,
          productVariantSlug: variant.slug,
          productVariantOptionSlug: variant.optionSlug,
        })),
      );
    }),
  );
}

seed().catch((err) => {
  console.error(`Seed failed with error ${err}`);
  process.exit(1);
});
