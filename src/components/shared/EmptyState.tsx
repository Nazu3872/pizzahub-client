import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionText,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/60 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/80 text-primary mb-4 text-3xl shadow-sm">
        {icon || "🍕"}
      </div>
      <h3 className="text-xl font-bold font-heading text-foreground mb-2">
        {title}
      </h3>
      <p className="max-w-md text-sm text-muted-foreground mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction} className="rounded-lg shadow-sm">
          {actionText}
        </Button>
      )}
    </div>
  );
}
