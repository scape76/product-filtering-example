import { getAllProductVariants } from "~/app/loaders";
import { AddProductForm } from "~/components/add-product-form";
import { ProductVariantsForm } from "~/components/product-variants-form";

export default async function AddProductPage() {
  const variants = await getAllProductVariants();

  return (
    <main className="container">
      <AddProductForm />
      <ProductVariantsForm variants={variants} />
    </main>
  );
}
