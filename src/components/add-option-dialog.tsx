"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { PlusIcon } from "@radix-ui/react-icons";
import { ProductVariant } from "~/server/db/schema";
import { AddOptionForm } from "./add-option-form";

export function AddOptionDialog({ variant }: { variant: ProductVariant }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="mt-2 px-2">
          <PlusIcon className="mr-2 size-4" />
          Add option for {variant.title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle> Add option for {variant.title}</DialogTitle>
        <AddOptionForm
          variantSlug={variant.slug}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
