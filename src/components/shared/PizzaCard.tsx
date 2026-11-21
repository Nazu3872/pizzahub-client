"use client";

import React from "react";
import Image from "next/image";
import { Star, Clock, Flame, ShoppingBag, Pizza } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export interface PizzaItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  restaurantName?: string;
  rating?: number;
  prepTimeMinutes?: number;
  isPopular?: boolean;
  isVegetarian?: boolean;
}

interface PizzaCardProps {
  pizza: PizzaItem;
  onAddToCart?: (pizza: PizzaItem) => void;
  onViewDetails?: (pizza: PizzaItem) => void;
}

export function PizzaCard({
  pizza,
  onAddToCart,
  onViewDetails,
}: PizzaCardProps) {
  const [imageError, setImageError] = React.useState(false);

  return (
    <Card className="group relative flex flex-col justify-between h-[420px] w-full overflow-hidden rounded-xl border border-border/80 bg-card hover:border-primary/50 hover:shadow-sm transition-[border-color,box-shadow] duration-200">
      {/* Top Image Section (Uniform Ratio) */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {!imageError && pizza.image ? (
          <img
            src={pizza.image}
            alt={pizza.name}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-muted text-muted-foreground gap-2">
            <Pizza className="h-10 w-10 text-primary/60" />
            <span className="text-xs font-medium">Stone-Oven Pizza</span>
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {pizza.isPopular && (
            <Badge className="bg-primary text-primary-foreground font-medium px-2 py-0.5 text-xs border-0">
              <Flame className="w-3 h-3 mr-1" /> Wood-Fired
            </Badge>
          )}
          {pizza.isVegetarian && (
            <Badge className="bg-emerald-600 text-white font-medium px-2 py-0.5 text-xs border-0">
              Vegetarian
            </Badge>
          )}
        </div>

        {pizza.rating && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-black/75 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-xs">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>{pizza.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <CardContent className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5 font-medium">
            <span className="truncate max-w-[160px]">
              {pizza.restaurantName || "PizzaHub Kitchen"}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground/90">
              <Clock className="w-3 h-3" />
              <span>800°F Stone Oven</span>
            </span>
          </div>

          <h3
            className="text-base font-bold font-heading text-foreground line-clamp-1 group-hover:text-primary transition-colors cursor-pointer"
            onClick={() => onViewDetails?.(pizza)}
          >
            {pizza.name}
          </h3>

          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {pizza.description}
          </p>
        </div>

        {/* Bottom Price and CTA */}
        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-muted-foreground block font-medium">
              Price
            </span>
            <span className="text-lg font-bold font-heading text-primary">
              {formatCurrency(pizza.price)}
            </span>
          </div>

          <Button
            size="sm"
            className="rounded-lg px-3.5 gap-1.5 font-medium shadow-xs"
            onClick={() => onAddToCart?.(pizza)}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
