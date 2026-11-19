"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Edit3,
  Loader2,
  Upload,
  Pizza,
  DollarSign,
  MapPin,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { MENU_CATEGORIES } from "./AddMenuItemDialog";

interface EditMenuItemDialogProps {
  item: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemUpdated: () => void;
}

export function EditMenuItemDialog({
  item,
  open,
  onOpenChange,
  onItemUpdated,
}: EditMenuItemDialogProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("Classic Pizzas");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setItemName(item.itemName || "");
      setCategory(item.category || "Classic Pizzas");
      setDescription(item.description || "");
      setPrice(item.price ? String(item.price) : "");
      setLocation(item.location || "");
      setImagePreview(item.images?.[0] || null);
      setImageFile(null);
    }
  }, [item]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image Too Large", {
        description: "Menu item photos must be under 5MB.",
      });
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      toast.error("Invalid Price", {
        description: "Please enter a valid positive price.",
      });
      return;
    }

    try {
      setLoading(true);
      let imageUrl = imagePreview || item.images?.[0] || "";

      if (imageFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (uploadData.success && uploadData.url) {
          imageUrl = uploadData.url;
        }
        setUploading(false);
      }

      const res = await api.put(`/vendor/menu-items/${item.id}`, {
        itemName: itemName.trim(),
        category,
        description: description.trim(),
        price: numPrice,
        location: location.trim(),
        images: [imageUrl],
      });

      if (res.success) {
        toast.success("Updated Successfully", {
          description: `"${itemName}" details have been updated.`,
        });
        onOpenChange(false);
        onItemUpdated();
      }
    } catch (err: any) {
      toast.error("Update Failed", {
        description: err.message || "Failed to update menu item.",
      });
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-heading font-bold">
            <Edit3 className="h-5 w-5 text-primary" />
            <span>Edit Menu Item</span>
          </DialogTitle>
          <DialogDescription>
            Update pricing, ingredients or details for this item.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="editItemName">Item Name</Label>
            <Input
              id="editItemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="editCategory">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="editCategory">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {MENU_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="editPrice">Price (USD)</Label>
              <Input
                id="editPrice"
                type="number"
                step="0.01"
                min="0.5"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="editLocation">Kitchen Area</Label>
              <Input
                id="editLocation"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="editDescription">Description</Label>
            <Textarea
              id="editDescription"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="editImage">Replace Photo (Optional)</Label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-border">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <Input
                  id="editImage"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="text-xs"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
