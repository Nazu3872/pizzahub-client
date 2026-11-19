"use client";

import React from "react";
import { useSession } from "@/lib/auth-client";
import { PageContainer } from "@/components/shared/PageContainer";
import { StatCard } from "@/components/shared/StatCard";
import { Store, DollarSign, Pizza, Users, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function VendorDashboard() {
  const { data: session } = useSession();
  const user = session?.user as any;

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-border gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-extrabold font-heading text-foreground">
              Vendor Kitchen Portal
            </h1>
            <Badge className="bg-primary text-white">Vendor</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Restaurant: <span className="font-semibold text-foreground">{user?.businessName || user?.name || "Kitchen"}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Revenue"
          value="$0.00"
          description="Gross earnings"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          title="Menu Items"
          value="0"
          description="Active pizzas listed"
          icon={<Pizza className="h-5 w-5" />}
        />
        <StatCard
          title="Orders Today"
          value="0"
          description="Pending & delivered"
          icon={<Store className="h-5 w-5" />}
        />
        <StatCard
          title="Customer Rating"
          value="5.0"
          description="Based on reviews"
          icon={<Star className="h-5 w-5 text-amber-500 fill-amber-500" />}
        />
      </div>
    </PageContainer>
  );
}
