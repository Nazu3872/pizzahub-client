"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Client page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-inner">
        <AlertCircle className="h-10 w-10" />
      </div>

      <h1 className="text-3xl font-extrabold font-heading text-foreground tracking-tight">
        Something Went Wrong
      </h1>
      <p className="mt-3 max-w-md text-base text-muted-foreground leading-relaxed">
        Our pizza oven had a temporary hiccup. We've logged this issue and our
        kitchen crew is already fixing it.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => reset()} className="gap-2 rounded-lg shadow-sm">
          <RotateCcw className="h-4 w-4" />
          <span>Try Again</span>
        </Button>
        <Link href="/">
          <Button variant="outline" className="gap-2 rounded-lg">
            <Home className="h-4 w-4" />
            <span>Return Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
