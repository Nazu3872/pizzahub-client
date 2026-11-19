"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { PageContainer } from "@/components/shared/PageContainer";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Pizza, ShoppingBag, ArrowLeft, Star, Clock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function MenuItemPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <ProtectedRoute>
      <PageContainer>
        <Link href="/pizzas" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Pizzas</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-card p-6 sm:p-10 rounded-2xl border border-border shadow-sm">
          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-muted flex items-center justify-center">
            <Pizza className="h-24 w-24 text-primary/40 animate-pulse" />
          </div>

          <div className="flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                <span>Authentic Wood-Fired Special</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground">
                Artisan Pizza Selection #{id}
              </h1>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                Freshly hand-stretched organic dough, slow-simmered San Marzano tomato coulis, imported mozzarella, and handpicked garden herbs. Baked at 800°F in a traditional stone oven.
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground block">Price</span>
                  <span className="text-3xl font-black font-heading text-primary">
                    $16.50
                  </span>
                </div>
                <Button
                  size="lg"
                  className="gap-2 shadow-md"
                  onClick={() => toast.success("Added pizza to order cart!")}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Add to Order</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}
