"use client";

import React from "react";
import { useSession } from "@/lib/auth-client";
import { PageContainer } from "@/components/shared/PageContainer";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { StatCard } from "@/components/shared/StatCard";
import { ShoppingBag, Clock, Heart, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CustomerDashboard() {
  const { data: session } = useSession();
  const user = session?.user as any;

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-border gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-extrabold font-heading text-foreground">
              Customer Dashboard
            </h1>
            <Badge variant="secondary">Customer</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Welcome back, <span className="font-semibold text-foreground">{user?.name || "Pizza Lover"}</span>!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Orders"
          value="0"
          description="Pizzas ordered to date"
          icon={<ShoppingBag className="h-5 w-5" />}
        />
        <StatCard
          title="Active Deliveries"
          value="0"
          description="Piping hot on the way"
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard
          title="Saved Pizzerias"
          value="0"
          description="Your favorite kitchens"
          icon={<Heart className="h-5 w-5" />}
        />
        <StatCard
          title="Account Status"
          value="Active"
          description="Verified Member"
          icon={<ShieldCheck className="h-5 w-5 text-emerald-600" />}
        />
      </div>
    </PageContainer>
  );
}
