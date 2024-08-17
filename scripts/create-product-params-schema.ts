// create product search params validation file

import "./console";
import { db } from "~/server/db";
import * as z from "zod";
import * as prettier from "prettier";
import prettierConfig from "prettier.config";

const contents = (keys: string[]) => {
  return `
  // this file is generated via script.
  // see scripts/create-product-params-validation.ts
  import * as z from "zod";

  export const productVariantsSearchParamsSchema = z.object({
    ${keys.map((key) => `${key}: z.string().optional(),`).join("\n")}
  });

  export const productSearchParamsSchema = productVariantsSearchParamsSchema.extend({
    page: z.coerce.number().default(1),
    name: z.string().optional(),
  });

  export const getProductsSchema = z.object({
    ${keys.map((key) => `${key}: z.array(z.string()).optional(),`).join("\n")}
    limit: z.number(),
    offset: z.number(),
    name: z.string().optional(),
  });

  export type ProductSearchParams = z.infer<typeof productSearchParamsSchema>;
  export type GetProducts = z.infer<typeof getProductsSchema>;
`;
};

async function createProductParamsSchemaFile() {
  const slugs = await db.query.productVariants
    .findMany({
      columns: {
        slug: true,
      },
    })
    .then((res) => res.map((v) => v.slug));

  const fileContents = contents(slugs);

  const formated = await prettier.format(fileContents, {
    ...prettierConfig,
    parser: "typescript",
  });

  const bytes = await Bun.write(
    "src/lib/validations/search-params.ts",
    formated,
  );

  console.success(
    `product params schema file was created. Wrote ${bytes} bytes`,
  );
  process.exit(0);
}

createProductParamsSchemaFile().catch((err) => {
  console.error(`Couldn't create product params schema: ${err}`);
  process.exit(1);
});
