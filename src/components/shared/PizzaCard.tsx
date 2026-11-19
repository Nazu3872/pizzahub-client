"use client";

import React from "react";
import Image from "next/image";
import { Star, Clock, Flame, ShoppingBag } from "lucide-react";
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
    <Card className="group relative flex flex-col justify-between h-[430px] w-full overflow-hidden border-border/80 bg-card hover:shadow-xl hover:border-primary/40 transition-all duration-300">
      {/* Top Image Section (Uniform Ratio) */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {!imageError && pizza.image ? (
          <img
            src={pizza.image}
            alt={pizza.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-100 to-orange-200 text-orange-800">
            <span className="text-4xl">🍕</span>
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {pizza.isPopular && (
            <Badge className="bg-primary text-primary-foreground font-semibold px-2 py-0.5 text-xs shadow-md">
              <Flame className="w-3 h-3 mr-1" /> Popular
            </Badge>
          )}
          {pizza.isVegetarian && (
            <Badge className="bg-emerald-600 text-white font-medium px-2 py-0.5 text-xs shadow-md">
              Veg
            </Badge>
          )}
        </div>

        {pizza.rating && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm shadow-md">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{pizza.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <CardContent className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5 font-medium">
            <span className="truncate max-w-[180px]">
              {pizza.restaurantName || "PizzaHub Kitchen"}
            </span>
            {pizza.prepTimeMinutes && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                {pizza.prepTimeMinutes}m
              </span>
            )}
          </div>

          <h3
            className="text-lg font-bold font-heading text-foreground line-clamp-1 group-hover:text-primary transition-colors cursor-pointer"
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
            <span className="text-xs text-muted-foreground block font-medium">
              Price
            </span>
            <span className="text-xl font-extrabold font-heading text-primary">
              {formatCurrency(pizza.price)}
            </span>
          </div>

          <Button
            size="sm"
            className="rounded-lg px-4 gap-1.5 shadow-sm"
            onClick={() => onAddToCart?.(pizza)}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
