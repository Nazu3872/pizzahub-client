import React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg" | "full";
}

export function PageContainer({
  children,
  className,
  size = "default",
}: PageContainerProps) {
  const sizeClasses = {
    sm: "max-w-4xl",
    default: "max-w-7xl",
    lg: "max-w-[1400px]",
    full: "max-w-full",
  };

  return (
    <main
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-all",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </main>
  );
}
