import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
  action?: React.ReactNode;
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  align = "center",
  className,
  action,
}: SectionHeadingProps) {
  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  };

  return (
    <div
      className={cn(
        "flex flex-col mb-10 max-w-2xl",
        alignmentClasses[align],
        className
      )}
    >
      {badge && (
        <Badge
          variant="secondary"
          className="mb-3 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-orange-100 text-orange-800 border-orange-200"
        >
          {badge}
        </Badge>
      )}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2.5 text-base sm:text-lg text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="mt-4 sm:mt-0">{action}</div>}
      </div>
    </div>
  );
}
