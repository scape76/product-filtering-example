import { db } from "~/server/db";
import {
  InsertProduct,
  InsertProductsToProductVariants,
  products,
  productsToProductVariants,
  productVariantOptions,
  productVariants,
} from "~/server/db/schema";
import cozyVariants from "./product-variants.json";
import cozyProducts from "./products.json";
import "../console";
import { faker } from "@faker-js/faker";

async function seed() {
  console.info("Running seed...");
  const start = Date.now();

  // cleanup
  await db.delete(products);
  await db.delete(productsToProductVariants);
  // await db.delete(productVariantOptions);
  // await db.delete(productVariants);

  // seed
  // await seedProductVariants();
  await seedProducts();

  const end = Date.now();

  console.success(`Seed completed in ${end - start}ms`);

  process.exit(0);
}

async function seedProducts() {
  const variants = await db.query.productVariants
    .findMany({
      columns: {
        slug: true,
      },
      with: {
        options: {
          columns: {
            slug: true,
          },
        },
      },
    })
    .then((res) =>
      res?.map((variant) => ({
        ...variant,
        options: variant.options.map((o) => o.slug),
      })),
    );

  const newProducts: InsertProduct[] = Array.from({
    length: 1000,
  });

  for (let i = 0; i < 1000; ++i) {
    newProducts[i] = {
      name: faker.commerce.productName(),
      slug: faker.lorem.slug() + i,
      image: faker.image.urlLoremFlickr({ category: "clothing" }),
    };
  }

  const newProductsToProductVariants: InsertProductsToProductVariants[] = [];

  newProducts.forEach((product) => {
    variants.forEach((variant) => {
      newProductsToProductVariants.push({
        productSlug: product.slug,
        productVariantSlug: variant.slug,
        productVariantOptionSlug: faker.helpers.arrayElement(variant.options),
      });
    });
  });

  await db.insert(products).values(newProducts);

  await db
    .insert(productsToProductVariants)
    .values(newProductsToProductVariants);
}

seed().catch((err) => {
  console.error(`Seed failed with error ${err}`);
  process.exit(1);
});
