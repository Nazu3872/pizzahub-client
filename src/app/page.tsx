"use client";

import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Pizza,
  Sparkles,
  Flame,
  Clock,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Store,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PizzaCard, PizzaItem } from "@/components/shared/PizzaCard";
import { StatCard } from "@/components/shared/StatCard";
import { PageContainer } from "@/components/shared/PageContainer";

const samplePizzas: PizzaItem[] = [
  {
    id: "p1",
    name: "Classic Margherita Napoletana",
    description:
      "San Marzano tomato coulis, fresh buffalo mozzarella, fragrant sweet basil leaves, and cold-pressed extra virgin olive oil.",
    price: 14.5,
    image:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80",
    category: "Classic",
    restaurantName: "Luigi's Woodfire Pizzeria",
    rating: 4.9,
    prepTimeMinutes: 20,
    isPopular: true,
    isVegetarian: true,
  },
  {
    id: "p2",
    name: "Spicy Pepperoni & Hot Honey",
    description:
      "Crispy artisan pepperoni cups, aged whole-milk mozzarella, fiery chili flakes, and organic habanero hot honey drizzle.",
    price: 17.0,
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
    category: "Specialty",
    restaurantName: "Brooklyn Brick Oven",
    rating: 4.8,
    prepTimeMinutes: 25,
    isPopular: true,
    isVegetarian: false,
  },
  {
    id: "p3",
    name: "Truffle Mushroom Bianco",
    description:
      "Roasted wild cremini & shiitake mushrooms, creamy fontina, fresh thyme, and white truffle infused olive oil.",
    price: 18.5,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    category: "Gourmet",
    restaurantName: "Toscana Hearth Kitchen",
    rating: 4.9,
    prepTimeMinutes: 22,
    isPopular: false,
    isVegetarian: true,
  },
];

export default function Home() {
  const handleAddToCart = (pizza: PizzaItem) => {
    toast.success(`Added ${pizza.name} to cart!`, {
      description: "You can customize or proceed to checkout anytime.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-background to-background py-16 sm:py-24 border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(#F57C00_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

        <PageContainer className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1 text-xs font-bold text-orange-800 shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-secondary animate-pulse" />
                <span>The Authentic Pizzeria Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight text-foreground leading-[1.1]">
                Hot, Crusty & Handcrafted{" "}
                <span className="text-primary inline-block">Artisan Pizza</span>,
                Delivered Fast.
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Connect directly with the finest wood-fired pizzerias in your
                neighborhood. Choose your favorite crust, customized toppings,
                and enjoy hot slice perfection.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link href="/pizzas">
                  <Button size="lg" className="gap-2.5 rounded-xl shadow-md text-base">
                    <span>Order Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/partner">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 rounded-xl text-base border-border hover:bg-muted"
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
                  <span>Wood-Fired Pizzerias</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>100% Quality Guaranteed</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image / Card Showcase */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-card/80 group">
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80"
                  alt="Delicious piping hot pizza"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <Badge className="bg-primary text-white border-0 font-bold mb-1">
                    Chef's Daily Special
                  </Badge>
                  <h3 className="text-xl font-bold font-heading">
                    Woodfired Quattro Formaggi
                  </h3>
                  <p className="text-xs text-white/80">
                    Gorgonzola, parmigiano reggiano, mozzarella & taleggio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Live Marketplace Highlights */}
      <section className="py-14 sm:py-20 bg-card/40 border-b border-border/50">
        <PageContainer>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Active Pizzerias"
              value="35+"
              description="Curated local kitchens"
              icon={<Store className="h-5 w-5" />}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Artisan Pizzas"
              value="120+"
              description="Wood-fired & pan varieties"
              icon={<Pizza className="h-5 w-5" />}
            />
            <StatCard
              title="Happy Foodies"
              value="4,850+"
              description="5-star ratings platform-wide"
              icon={<Users className="h-5 w-5" />}
              trend={{ value: 24, isPositive: true }}
            />
            <StatCard
              title="Fastest Delivery"
              value="18 min"
              description="Fresh out of the oven"
              icon={<Clock className="h-5 w-5" />}
            />
          </div>
        </PageContainer>
      </section>

      {/* Featured Pizzas Section */}
      <section className="py-16 sm:py-24">
        <PageContainer>
          <SectionHeading
            badge="Customer Favorites"
            title="Fresh Out of the Wood Oven"
            subtitle="Explore our top-selling artisan pizzas prepared with organic dough, hand-stretched crusts, and premium imported toppings."
            action={
              <Link href="/pizzas">
                <Button variant="outline" className="gap-2">
                  <span>View Full Menu</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {samplePizzas.map((pizza) => (
              <PizzaCard
                key={pizza.id}
                pizza={pizza}
                onAddToCart={handleAddToCart}
                onViewDetails={(item) => {
                  toast.info(`Viewing details for ${item.name}`);
                }}
              />
            ))}
          </div>
        </PageContainer>
      </section>
    </div>
  );
}
