// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
  primaryKey,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `product-filtering_${name}`,
);

export const products = createTable(
  "product",
  {
    slug: varchar("slug", { length: 256 }).primaryKey(),
    name: text("name").notNull(),
    image: text("image"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export const productsToProductVariants = createTable(
  "products_to_product_variants",
  {
    productSlug: varchar("product_slug")
      .notNull()
      .references(() => products.slug),
    productVariantSlug: varchar("product_variant_slug")
      .notNull()
      .references(() => productVariants.slug),
    productVariantOptionSlug: varchar("product_variant_option_slug")
      .notNull()
      .references(() => productVariantOptions.slug),
  },
  (example) => ({
    primaryKey: primaryKey({
      columns: [example.productSlug, example.productVariantSlug],
    }),
  }),
);

export type ProductsToProductVariants =
  typeof productsToProductVariants.$inferSelect;
export type InsertProductsToProductVariants =
  typeof productsToProductVariants.$inferInsert;

export const productVariants = createTable("product_variant", {
  slug: varchar("slug", { length: 256 }).primaryKey(),
  title: text("title"),
});

export type ProductVariant = typeof productVariants.$inferSelect;
export type InsertProductVariant = typeof productVariants.$inferInsert;

export const productVariantsRelations = relations(
  productVariants,
  ({ many }) => ({
    options: many(productVariantOptions),
  }),
);

export const productVariantOptions = createTable("product_variant_option", {
  slug: varchar("slug", { length: 256 }).primaryKey(),
  variantSlug: varchar("variant_slug").notNull(),
  title: text("title"),
});

export type ProductVariantOption = typeof productVariantOptions.$inferSelect;
export type InsertProductVariantOption =
  typeof productVariantOptions.$inferInsert;

export const productVariantOptionsRelations = relations(
  productVariantOptions,
  ({ one }) => ({
    variant: one(productVariants, {
      fields: [productVariantOptions.variantSlug],
      references: [productVariants.slug],
    }),
  }),
);
