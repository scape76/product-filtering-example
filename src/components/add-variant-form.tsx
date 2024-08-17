import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { isSlugValid, slugify } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useState } from "react";
import { createProductVariant } from "~/app/actions";
import { toast } from "sonner";
import { variantSchema } from "~/lib/validations/variant";
import { ReloadIcon, ResetIcon } from "@radix-ui/react-icons";

export function AddVariantForm({ onSuccess }: { onSuccess: () => void }) {
  const form = useForm<z.infer<typeof variantSchema>>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      title: "",
      slug: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const [changed, setChanged] = useState(false);

  async function onSubmit(values: z.infer<typeof variantSchema>) {
    setLoading(true);

    const result = await createProductVariant(values);

    if (result && "error" in result) {
      toast.error(result.error);
    } else {
      toast.success("Successfully created new variant");
      onSuccess();
    }

    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="brand"
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
                      form.setValue("slug", slugify(form.getValues("title")));
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