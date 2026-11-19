"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Pizza,
  Sparkles,
  Flame,
  Clock,
  ShieldCheck,
  ArrowRight,
  Store,
  ChefHat,
  Truck,
  HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PizzaCard, PizzaItem } from "@/components/shared/PizzaCard";
import { PageContainer } from "@/components/shared/PageContainer";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { MENU_CATEGORIES } from "@/components/vendor/AddMenuItemDialog";

// Category metadata with icons & background highlights
const categoryVisuals: Record<string, { emoji: string; color: string; desc: string }> = {
  "Classic Pizzas": {
    emoji: "🍕",
    color: "from-red-500/10 to-orange-500/10",
    desc: "Napoletana, Margherita & Marinara",
  },
  "Vegetarian Pizzas": {
    emoji: "🥗",
    color: "from-emerald-500/10 to-teal-500/10",
    desc: "Fresh veggies, artichoke & rich pesto",
  },
  "Meat Lovers": {
    emoji: "🥩",
    color: "from-amber-500/10 to-red-500/10",
    desc: "Crispy pepperoni, smoked bacon & beef",
  },
  "Specialty / Gourmet Pizzas": {
    emoji: "✨",
    color: "from-purple-500/10 to-pink-500/10",
    desc: "White truffle, fontina & prosciutto",
  },
  "Sides & Appetizers": {
    emoji: "🧄",
    color: "from-yellow-500/10 to-orange-500/10",
    desc: "Garlic knots, wings & cheesy breadsticks",
  },
  "Beverages & Desserts": {
    emoji: "🍰",
    color: "from-orange-500/10 to-amber-500/10",
    desc: "Mascarpone tiramisu & Italian sodas",
  },
};

export default function HomePage() {
  const router = useRouter();
  const [featuredItems, setFeaturedItems] = useState<PizzaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        setLoading(true);
        const res = await api.get("/menu-items/featured", { skipAuth: true });
        if (res.success && res.data) {
          const mapped: PizzaItem[] = res.data.map((item: any) => ({
            id: item.id || item._id,
            name: item.itemName,
            description: item.description,
            price: item.price,
            image: item.images?.[0] || "",
            category: item.category,
            restaurantName: item.vendorName || "Artisan Kitchen",
            rating: 4.9,
            prepTimeMinutes: 20,
            isPopular: item.isPremiumVendor || false,
          }));
          setFeaturedItems(mapped);
        }
      } catch (err: any) {
        console.error("Failed to fetch featured pizzas:", err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, []);

  const handleAddToCart = (pizza: PizzaItem) => {
    toast.success(`Added ${pizza.name} to order cart!`, {
      description: "Customize your order or proceed to checkout anytime.",
    });
  };

  const handleViewDetails = (pizza: PizzaItem) => {
    router.push(`/menu/${pizza.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-background to-background py-16 sm:py-24 border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(#F57C00_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

        <PageContainer className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1 text-xs font-bold text-orange-800 shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-secondary animate-pulse" />
                <span>Wood-Fired Artisanal Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight text-foreground leading-[1.1]">
                Hot & Fresh Pizza{" "}
                <span className="text-primary inline-block">Delivered to Your Door</span>.
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Connect directly with independent local pizzerias. Handcrafted organic dough, slow-simmered tomato coulis, and authentic oven-baked crusts.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="/menu">
                  <Button size="lg" className="gap-2.5 rounded-xl shadow-md text-base px-6">
                    <span>Explore Pizza Menu</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/partner">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 rounded-xl text-base px-6 border-border hover:bg-muted"
                  >
                    <Store className="h-4 w-4 text-secondary" />
                    <span>Join as Vendor</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-border/70 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-muted-foreground font-semibold">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Avg. 25 Min Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-secondary" />
                  <span>Wood-Fired Crusts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>100% Quality Guaranteed</span>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5 relative flex justify-center"
            >
              <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-card/80 group">
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80"
                  alt="Hot & Fresh Artisan Pizza"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <Badge className="bg-primary text-white border-0 font-bold mb-1">
                    Featured Special
                  </Badge>
                  <h3 className="text-xl font-bold font-heading">
                    Wood-Fired Quattro Formaggi
                  </h3>
                  <p className="text-xs text-white/80">
                    Artisan gorgonzola, fontina, aged mozzarella & parmigiano.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </PageContainer>
      </section>

      {/* 2. Featured Menu Items (>= 6 items from real DB) */}
      <section className="py-16 sm:py-24 bg-card/40 border-b border-border/50">
        <PageContainer>
          <SectionHeading
            badge="Featured Pizzas"
            title="Fresh Out of the Wood Oven"
            subtitle="Top-rated artisan pizzas handcrafted by verified local pizzerias."
            action={
              <Link href="/menu">
                <Button variant="outline" className="gap-2">
                  <span>View All Pizzas</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            }
          />

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col h-[430px] rounded-xl border border-border p-4 space-y-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <Skeleton className="h-9 w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : featuredItems.length === 0 ? (
            <EmptyState
              icon={<Pizza className="h-8 w-8 text-primary" />}
              title="No Featured Pizzas Yet"
              description="Our local kitchens are currently baking new recipes. Check back shortly!"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredItems.map((pizza) => (
                <PizzaCard
                  key={pizza.id}
                  pizza={pizza}
                  onAddToCart={handleAddToCart}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </PageContainer>
      </section>

      {/* 3. Pizza Categories Section */}
      <section className="py-16 sm:py-24">
        <PageContainer>
          <SectionHeading
            badge="Categories"
            title="Browse by Pizza Specialty"
            subtitle="From traditional Neapolitan classics to gourmet white sauces and decadent desserts."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MENU_CATEGORIES.map((cat, idx) => {
              const meta = categoryVisuals[cat] || { emoji: "🍕", color: "from-primary/10 to-orange-500/10", desc: "Fresh artisan pizza" };
              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <Link
                    href={`/menu?category=${encodeURIComponent(cat)}`}
                    className="group block p-6 rounded-2xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent text-3xl shadow-xs group-hover:scale-110 transition-transform">
                        {meta.emoji}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                          {cat}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {meta.desc}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </PageContainer>
      </section>

      {/* 4. Why Choose PizzaHub & How It Works */}
      <section className="py-16 sm:py-24 bg-card/60 border-t border-border/50">
        <PageContainer>
          <SectionHeading
            badge="The PizzaHub Standard"
            title="How PizzaHub Works"
            subtitle="Ordering authentic artisan pizza has never been faster or easier."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-card border border-border shadow-xs">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5 shadow-xs">
                <ChefHat className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold font-heading text-foreground mb-2">
                1. Pick Local Artisan Pizzerias
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Browse handpicked local kitchens using organic dough, fresh mozzarella, and stone-fired ovens.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-card border border-border shadow-xs">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10 text-secondary mb-5 shadow-xs">
                <Flame className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold font-heading text-foreground mb-2">
                2. Freshly Baked to Order
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your selected pizza is stretched and baked hot at 800°F immediately upon order confirmation.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-card border border-border shadow-xs">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 mb-5 shadow-xs">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold font-heading text-foreground mb-2">
                3. Piping Hot Delivery
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Packaged in insulated thermal pizza carriers and delivered directly to your doorstep in 25 minutes.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>
    </div>
  );
}
