import Link from "next/link";

import { Button, buttonVariants } from "~/components/ui/button";
import { AddVariantDialog } from "../components/add-variant-dialog";
import { VariantBlock } from "~/components/variant-block";
import { getAllProductVariants, getFilteredProducts } from "./loaders";
import { cn } from "~/lib/utils";
import {
  ProductSearchParams,
  productSearchParamsSchema,
} from "~/lib/validations/search-params";
import { ProductCard } from "~/components/product-card";
import { SearchInput } from "~/components/search-input";
import { ProductsPagination } from "~/components/products-pagination";
import { ProductFilters } from "~/components/product-filters";

import { Drawer } from "vaul";
import { MobileFilters } from "~/components/mobile-filters";
import { ScrollArea } from "~/components/ui/scroll-area";
import { SelectedOptions } from "~/components/selected-options";
import { Icons } from "~/components/icons";

interface PageProps {
  searchParams: ProductSearchParams;
}

export default async function Page({ searchParams }: PageProps) {
  const { brand, color, size, gender, material, type, page, name } =
    productSearchParamsSchema.parse(searchParams);

  const limit = 12;
  const offset = page > 1 ? limit * (page - 1) : 0;

  const variants = await getAllProductVariants();

  const products = await getFilteredProducts({
    brand: brand ? brand.split("|") : undefined,
    color: color ? color.split("|") : undefined,
    size: size ? size.split("|") : undefined,
    gender: gender ? gender.split("|") : undefined,
    material: material ? material.split("|") : undefined,
    type: type ? type.split("|") : undefined,
    limit,
    offset,
    name,
  });

  return (
    <div className="container grid min-h-screen w-full md:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="sticky top-0">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Icons.filter className="mr-2 size-5" />
            Filtering example
          </div>
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                {/* <AddVariantDialog /> */}
                <ScrollArea className="mt-2 h-[calc(100vh-80px)] pr-4">
                  <ProductFilters variants={variants} />
                </ScrollArea>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            <SearchInput />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
          </div>
          <SelectedOptions />
          <MobileFilters variants={variants} />
          {products.data.length > 0 && (
            <div className="grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.data.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}
          {products.data.length == 0 && (
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                You have no products
              </h3>
              <Link
                className={cn(buttonVariants(), "mt-4")}
                href={"/product/new"}
              >
                Add Product
              </Link>
            </div>
          )}
          <ProductsPagination pageCount={products.pageCount} />
        </main>
      </div>
    </div>
  );
}
