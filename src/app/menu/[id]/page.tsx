"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Pizza,
  ArrowLeft,
  MapPin,
  Store,
  Clock,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Info,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { PageContainer } from "@/components/shared/PageContainer";
import { PageLoader } from "@/components/shared/PageLoader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function MenuItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: session, isPending: sessionLoading } = useSession();
  const user = session?.user as any;

  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    // If user is not logged in after session resolves, redirect to signin
    if (!sessionLoading && !session) {
      router.replace(`/signin?callbackURL=/menu/${id}`);
      return;
    }

    async function loadItem() {
      try {
        setLoading(true);
        const res = await api.get(`/menu-items/${id}`);
        if (res.success && res.data) {
          setItem(res.data);
          setSelectedImage(res.data.images?.[0] || "");
        } else {
          setError("Item not found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load pizza details.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadItem();
    }
  }, [id, session, sessionLoading, router]);

  if (sessionLoading || loading) {
    return <PageLoader message="Retrieving fresh oven details..." />;
  }

  if (error || !item) {
    return (
      <PageContainer>
        <EmptyState
          icon={<Pizza className="h-10 w-10 text-primary" />}
          title="Pizza Item Not Found"
          description="This pizza may have been archived, unlisted, or does not exist."
          actionText="Back to Menu"
          onAction={() => router.push("/menu")}
        />
      </PageContainer>
    );
  }

  // Determine ordering restrictions
  const isAdmin = user?.role === "admin";
  const isOwner = user?.role === "vendor" && user?.id === item.vendorId;

  let orderDisabled = false;
  let disabledReason = "";

  if (isAdmin) {
    orderDisabled = true;
    disabledReason = "Administrators cannot place pizza orders";
  } else if (isOwner) {
    orderDisabled = true;
    disabledReason = "Vendors cannot purchase their own menu items";
  }

  const handleOrder = () => {
    toast.success(`Added ${item.itemName} to your order!`, {
      description: "Proceed to checkout to review delivery details.",
    });
  };

  return (
    <PageContainer>
      {/* Back Button */}
      <Link
        href="/menu"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Menu Catalog</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-card p-6 sm:p-10 rounded-3xl border border-border/80 shadow-md">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-muted border border-border shadow-inner">
            <img
              src={selectedImage || item.images?.[0]}
              alt={item.itemName}
              className="h-full w-full object-cover transition-all duration-300"
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary text-primary-foreground font-bold px-3 py-1 text-xs shadow-md">
                {item.category}
              </Badge>
            </div>
          </div>

          {/* Multiple Images Thumbnail Strip */}
          {item.images && item.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pt-2">
              {item.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative h-20 w-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImage === img
                      ? "border-primary ring-2 ring-primary/20 scale-105"
                      : "border-border/80 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Order Box */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md">
                <Store className="h-3.5 w-3.5 text-primary" />
                <span>{item.vendorName || "Artisan Kitchen"}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md">
                <MapPin className="h-3.5 w-3.5 text-secondary" />
                <span>{item.location}</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-foreground tracking-tight leading-tight">
              {item.itemName}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed pt-2">
              {item.description}
            </p>

            {/* Preparation / Quality Perks */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/70 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>Freshly Baked in 20 Mins</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>100% Quality Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Pricing & CTA Order Container */}
          <div className="space-y-4 pt-6 border-t border-border">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-muted-foreground block font-medium">
                  Item Price
                </span>
                <span className="text-4xl font-black font-heading text-primary">
                  {formatCurrency(item.price)}
                </span>
              </div>
            </div>

            {/* Disabled Reason Alert if Restricted */}
            {orderDisabled && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/80 text-xs font-medium text-muted-foreground border border-border">
                <Info className="h-4 w-4 text-amber-500 shrink-0" />
                <span>{disabledReason}</span>
              </div>
            )}

            <Button
              size="lg"
              className="w-full py-6 text-base font-bold shadow-lg gap-2.5 rounded-xl"
              disabled={orderDisabled}
              onClick={handleOrder}
            >
              <ShoppingBag className="h-5 w-5" />
              <span>{orderDisabled ? "Ordering Restricted" : "Add to Order Cart"}</span>
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
