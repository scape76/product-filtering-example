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
import { productSchema } from "~/lib/validations/product";
import { ReloadIcon, ResetIcon } from "@radix-ui/react-icons";

export function AddProductForm() {
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const [changed, setChanged] = useState(false);

  async function onSubmit(values: z.infer<typeof productSchema>) {
    setLoading(true);

    const result = await createProduct(values);

    if (result && "error" in result) {
      toast.error(result.error);
    } else {
      toast.success("Successfully created new product.");
    }

    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    if (!changed)
                      form.setValue("slug", slugify(e.target.value));
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    onChange={(e) => {
                      setChanged(true);
                      field.onChange(e);
                    }}
                    className="pr-10"
                  />
                  <Button
                    size={"icon"}
                    className="absolute right-0 top-0"
                    onClick={() => {
                      setChanged(false);
                      form.setValue("slug", slugify(form.getValues("name")));
                    }}
                  >
                    <ResetIcon className="size-4" />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading && <ReloadIcon className="mr-2 size-4" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
