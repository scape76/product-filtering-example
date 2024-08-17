"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { PlusIcon } from "@radix-ui/react-icons";
import { AddVariantForm } from "~/components/add-variant-form";

export function AddVariantDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-2">
          <PlusIcon className="mr-2 size-4" />
          Add variant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <AddVariantForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
