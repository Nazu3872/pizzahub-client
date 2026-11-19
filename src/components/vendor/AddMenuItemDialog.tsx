"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Loader2,
  Upload,
  Pizza,
  DollarSign,
  MapPin,
  FileText,
  Tag,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
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

export const MENU_CATEGORIES = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
];

interface AddMenuItemDialogProps {
  onItemAdded: () => void;
  disabled?: boolean;
}

export function AddMenuItemDialog({
  onItemAdded,
  disabled = false,
}: AddMenuItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("Classic Pizzas");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("Gulshan-2, Dhaka");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemName.trim()) {
      toast.error("Name Required", { description: "Please enter an item name." });
      return;
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      toast.error("Invalid Price", {
        description: "Please enter a valid positive price.",
      });
      return;
    }

    if (!imageFile && !imagePreview) {
      toast.error("Image Required", {
        description: "Please upload at least 1 photo for this menu item.",
      });
      return;
    }

    try {
      setLoading(true);
      let imageUrl = imagePreview || "";

      // 1. Upload image to ImgBB via /api/upload
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
        } else {
          throw new Error(uploadData.message || "Image upload failed");
        }
        setUploading(false);
      }

      // 2. Create menu item via Express server API
      const res = await api.post("/vendor/menu-items", {
        itemName: itemName.trim(),
        category,
        description: description.trim(),
        price: numPrice,
        location: location.trim(),
        images: [imageUrl],
      });

      if (res.success) {
        toast.success("Item Added Successfully!", {
          description: `"${itemName}" has been submitted for approval.`,
        });

        // Reset form
        setItemName("");
        setDescription("");
        setPrice("");
        setImageFile(null);
        setImagePreview(null);
        setOpen(false);

        onItemAdded();
      }
    } catch (err: any) {
      toast.error("Failed to Add Item", {
        description: err.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          <span>Add Menu Item</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-heading font-bold">
            <Pizza className="h-5 w-5 text-primary" />
            <span>Add New Menu Item</span>
          </DialogTitle>
          <DialogDescription>
            List a new artisanal pizza or dish in your kitchen catalog.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Item Name */}
          <div className="space-y-1.5">
            <Label htmlFor="itemName">Item Name *</Label>
            <div className="relative">
              <Pizza className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="itemName"
                placeholder="e.g. Woodfired Truffle Margherita"
                className="pl-10"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
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

          {/* Price & Location */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="price">Price (USD) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.5"
                  placeholder="16.50"
                  className="pl-10"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location">Kitchen Area / City *</Label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="e.g. Gulshan-2, Dhaka"
                  className="pl-10"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Description & Ingredients *</Label>
            <Textarea
              id="description"
              placeholder="Crispy hand-stretched dough, San Marzano tomato coulis, fresh mozzarella..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Item Photo (Required) *</Label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-border shadow-sm">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-muted text-muted-foreground border border-dashed">
                  <Upload className="h-6 w-6" />
                </div>
              )}
              <div className="flex-1">
                <Input
                  id="image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  PNG, JPG, or WEBP up to 5MB.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{uploading ? "Uploading Image..." : "Submitting..."}</span>
                </>
              ) : (
                <span>Add Item</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
