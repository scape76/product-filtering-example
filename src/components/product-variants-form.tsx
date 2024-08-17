"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { isSlugValid, slugify } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useState } from "react";
import { createProduct, createProductVariantOption } from "~/app/actions";
import { toast } from "sonner";
import { productVariantsSchema } from "~/lib/validations/product";
import { ReloadIcon, ResetIcon } from "@radix-ui/react-icons";
import { ProductVariantWithOptions } from "~/types";
import { Label } from "./ui/label";
import { ProductVariant } from "~/server/db/schema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export function ProductVariantsForm({
  variants,
}: {
  variants: ProductVariantWithOptions[];
}) {
  const form = useForm<z.infer<typeof productVariantsSchema>>({
    resolver: zodResolver(productVariantsSchema),
    defaultValues: [],
  });

  const [loading, setLoading] = useState(false);

  const [changed, setChanged] = useState(false);

  async function onSubmit(values: z.infer<typeof productVariantsSchema>) {
    // setLoading(true);
    // const result = await createProduct(values);
    // if (result && "error" in result) {
    //   toast.error(result.error);
    // } else {
    //   toast.success("Successfully created new product.");
    // }
    // setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {variants.map((variant) => (
          <VariantField variant={variant} />
        ))}

        <Button type="submit" disabled={loading}>
          {loading && <ReloadIcon className="mr-2 size-4" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}

function VariantField({ variant }: { variant: ProductVariantWithOptions }) {
  return (
    <div className="flex items-center justify-between">
      <Label>{variant.title}</Label>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={`Select a ${variant.title}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{variant.title}</SelectLabel>
            {variant.options.map((option) => (
              <SelectItem value={option.slug} key={option.slug}>
                {option.title}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
