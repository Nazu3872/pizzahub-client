"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface DeleteMenuItemDialogProps {
  item: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemDeleted: () => void;
}

export function DeleteMenuItemDialog({
  item,
  open,
  onOpenChange,
  onItemDeleted,
}: DeleteMenuItemDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!item) return;

    try {
      setLoading(true);
      const res = await api.delete(`/vendor/menu-items/${item.id}`);

      if (res.success) {
        toast.success("Item Deleted", {
          description: `"${item.itemName}" was successfully removed from your menu.`,
        });
        onOpenChange(false);
        onItemDeleted();
      }
    } catch (err: any) {
      toast.error("Delete Failed", {
        description: err.message || "Could not delete this menu item.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-2">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-xl font-heading font-bold">
            Delete Menu Item?
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            Are you sure you want to permanently delete{" "}
            <span className="font-bold text-foreground">"{item?.itemName}"</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-4 border-t border-border gap-2 sm:justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>Confirm Delete</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
