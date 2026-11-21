import React from "react";
import { Pizza } from "lucide-react";
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
        "flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border/80 bg-card/60",
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-primary mb-4 shadow-xs">
        {icon || <Pizza className="h-7 w-7 text-primary" />}
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
