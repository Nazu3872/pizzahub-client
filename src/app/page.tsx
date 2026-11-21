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
  Leaf,
  Beef,
  Award,
  Sandwich,
  Coffee,
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

// Category metadata with clean line icons & artisan descriptions
const categoryVisuals: Record<string, { icon: React.ComponentType<{ className?: string }>; desc: string }> = {
  "Classic Pizzas": {
    icon: Pizza,
    desc: "Napoletana, Margherita & Marinara",
  },
  "Vegetarian Pizzas": {
    icon: Leaf,
    desc: "Fresh veggies, artichoke & basil pesto",
  },
  "Meat Lovers": {
    icon: Beef,
    desc: "Crispy pepperoni, smoked bacon & beef",
  },
  "Specialty / Gourmet Pizzas": {
    icon: Award,
    desc: "White truffle, fontina & prosciutto",
  },
  "Sides & Appetizers": {
    icon: Sandwich,
    desc: "Garlic knots, wings & breadsticks",
  },
  "Beverages & Desserts": {
    icon: Coffee,
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
      <section className="relative overflow-hidden bg-background py-16 sm:py-24 border-b border-border/70">
        <PageContainer className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column Content */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-accent/60 px-3 py-1 text-xs font-medium text-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Wood-Fired Artisanal Platform</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading tracking-tight text-foreground leading-[1.15]">
                Hot & Fresh Pizza{" "}
                <span className="text-primary inline-block">Delivered to Your Door</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Connect directly with independent local pizzerias. Handcrafted organic dough, slow-simmered tomato coulis, and authentic stone oven crusts.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link href="/menu">
                  <Button size="lg" className="gap-2 rounded-lg text-sm px-5 font-medium shadow-xs">
                    <span>Explore Pizza Menu</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/signup?role=vendor">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 rounded-lg text-sm px-5 font-medium border-border hover:bg-muted"
                  >
                    <Store className="h-4 w-4 text-primary" />
                    <span>Join as Vendor</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-border/70 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Avg. 25 Min Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-primary" />
                  <span>800°F Stone Oven</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>100% Quality Guaranteed</span>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Visual */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5 relative flex justify-center"
            >
              <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-sm border border-border/80">
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80"
                  alt="Hot & Fresh Artisan Pizza"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                  <Badge className="bg-primary text-white border-0 font-medium mb-1 text-[11px]">
                    800°F Stone Oven
                  </Badge>
                  <h3 className="text-lg font-bold font-heading">
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
              const meta = categoryVisuals[cat] || {
                icon: Pizza,
                desc: "Fresh artisan pizza",
              };
              const IconComp = meta.icon;
              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                >
                  <Link
                    href={`/menu?category=${encodeURIComponent(cat)}`}
                    className="group block p-5 rounded-xl border border-border/80 bg-card hover:border-primary/50 hover:shadow-xs transition-[border-color,box-shadow] duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <IconComp className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-bold text-base text-foreground group-hover:text-primary transition-colors truncate">
                          {cat}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {meta.desc}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </PageContainer>
      </section>

      {/* 4. Why Choose PizzaHub? (Required Extra Section 1) */}
      <section className="py-16 sm:py-24 bg-card/40 border-t border-border/70">
        <PageContainer>
          <SectionHeading
            badge="The PizzaHub Craft"
            title="Why Choose PizzaHub?"
            subtitle="We connect local artisan kitchens directly to your table, maintaining real wood-fired baking standards."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col p-6 rounded-xl bg-card border border-border/80 hover:border-primary/50 transition-[border-color] duration-200">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <Flame className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold font-heading text-foreground mb-1.5">
                Authentic Wood-Fired
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Baked in 800°F refractory stone ovens for that iconic blistered, leopard-spotted Neapolitan crust.
              </p>
            </div>

            <div className="flex flex-col p-6 rounded-xl bg-card border border-border/80 hover:border-primary/50 transition-[border-color] duration-200">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <ChefHat className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold font-heading text-foreground mb-1.5">
                Independent Artisans
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Support passionate neighborhood pizzaiolos who craft small-batch slow-fermented organic dough.
              </p>
            </div>

            <div className="flex flex-col p-6 rounded-xl bg-card border border-border/80 hover:border-primary/50 transition-[border-color] duration-200">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold font-heading text-foreground mb-1.5">
                Premium Ingredients
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Zero artificial preservatives. Only San Marzano tomatoes, fresh fiordilatte, and extra virgin olive oil.
              </p>
            </div>

            <div className="flex flex-col p-6 rounded-xl bg-card border border-border/80 hover:border-primary/50 transition-[border-color] duration-200">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <Truck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold font-heading text-foreground mb-1.5">
                Thermal Express Delivery
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Rushed in custom heated thermal cases so your crust arrives crisp and the cheese perfectly melted.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 5. How PizzaHub Works (Extra Section 2) */}
      <section className="py-16 sm:py-24 border-t border-border/70">
        <PageContainer>
          <SectionHeading
            badge="Three Step Process"
            title="How PizzaHub Works"
            subtitle="Ordering authentic artisan pizza straight from stone hearth to table."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border/80">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <ChefHat className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-foreground mb-2">
                1. Pick Local Artisan Pizzerias
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Browse handpicked local kitchens using organic dough, fresh mozzarella, and stone-fired ovens.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border/80">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <Flame className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-foreground mb-2">
                2. Freshly Baked to Order
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your selected pizza is stretched and baked hot at 800°F immediately upon order confirmation.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border/80">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-foreground mb-2">
                3. Piping Hot Delivery
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Packaged in insulated thermal pizza carriers and delivered directly to your doorstep in 25 minutes.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>
    </div>
  );
}
