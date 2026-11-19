import React from "react";
import { cn } from "@/lib/utils";

interface PageLoaderProps {
  message?: string;
  className?: string;
}

export function PageLoader({
  message = "Baking fresh content for you...",
  className,
}: PageLoaderProps) {
  return (
    <div
      className={cn(
        "flex min-h-[50vh] flex-col items-center justify-center p-8 text-center",
        className
      )}
    >
      <div className="relative flex items-center justify-center mb-4">
        {/* Animated spinning pizza oven flame indicator */}
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <span className="absolute text-2xl animate-bounce">🍕</span>
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        {message}
      </p>
    </div>
  );
}
