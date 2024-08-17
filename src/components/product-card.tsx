import { cn } from "~/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Product } from "~/server/db/schema";
import { PlaceholderImage } from "./placeholder-image";
import { AspectRatio } from "./ui/aspect-ratio";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps extends React.ComponentProps<typeof Card> {
  product: Pick<Product, "slug" | "name" | "image">;
}

export function ProductCard({
  product,
  className,
  ...props
}: ProductCardProps) {
  return (
    <Card
      className={cn(
        "group flex size-full flex-col overflow-hidden rounded-sm shadow-md",
        className,
      )}
      {...props}
    >
      <Link aria-label={product.name} href={`/product/${product.slug}`}>
        <CardHeader className="border-b p-0">
          <AspectRatio ratio={4 / 3} className="relative">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                className="object-cover"
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                fill
                loading="lazy"
              />
            ) : (
              <PlaceholderImage className="rounded-none" asChild />
            )}
          </AspectRatio>
        </CardHeader>
        <span className="sr-only">{product.name}</span>
      </Link>
      <div className="flex flex-1 flex-col justify-between">
        <Link
          href={`/product/${product.slug}`}
          tabIndex={-1}
          className="group/bento"
        >
          <CardContent className="space-y-1.5 p-4 transition duration-200 group-hover/bento:translate-x-2">
            <CardTitle>{product.name}</CardTitle>
          </CardContent>
        </Link>
      </div>
    </Card>
  );
}
