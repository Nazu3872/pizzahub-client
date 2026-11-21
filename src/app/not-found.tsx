import React from "react";
import Link from "next/link";
import { Pizza, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-orange-100 text-primary shadow-inner">
        <Pizza className="h-12 w-12 stroke-[2]" />
        <span className="absolute -bottom-2 -right-2 rounded-full bg-secondary px-2 py-0.5 text-xs font-black text-white shadow">
          404
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground tracking-tight">
        Crust Not Found
      </h1>
      <p className="mt-3 max-w-md text-base text-muted-foreground leading-relaxed">
        The pizza page you're searching for was either devoured by our bakers,
        moved to a different oven, or never existed in the first place!
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button className="gap-2 rounded-lg shadow-sm">
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
        </Link>
        <Link href="/menu">
          <Button variant="outline" className="gap-2 rounded-lg">
            <ArrowLeft className="h-4 w-4" />
            <span>Browse Menu</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
