"use client";

import React from "react";
import { useSession } from "@/lib/auth-client";
import { PageContainer } from "@/components/shared/PageContainer";
import { StatCard } from "@/components/shared/StatCard";
import { Shield, Users, Store, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const user = session?.user as any;

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-border gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-extrabold font-heading text-foreground">
              Platform Administration
            </h1>
            <Badge variant="destructive">Admin Portal</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Authenticated Admin: <span className="font-semibold text-foreground">{user?.email || "Superadmin"}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Users"
          value="--"
          description="Customers & Vendors"
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          title="Active Kitchens"
          value="--"
          description="Approved Pizzerias"
          icon={<Store className="h-5 w-5" />}
        />
        <StatCard
          title="Platform Volume"
          value="$0.00"
          description="Gross merchandise value"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          title="Security Status"
          value="Protected"
          description="Better Auth & JWT verification"
          icon={<Shield className="h-5 w-5 text-emerald-600" />}
        />
      </div>
    </PageContainer>
  );
}
