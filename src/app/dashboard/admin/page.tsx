"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { PageContainer } from "@/components/shared/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminOverviewTab } from "@/components/admin/AdminOverviewTab";
import { AdminUsersTab } from "@/components/admin/AdminUsersTab";
import { AdminMenuItemsTab } from "@/components/admin/AdminMenuItemsTab";
import { AdminTransactionsTab } from "@/components/admin/AdminTransactionsTab";
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Pizza,
  CreditCard,
  LayoutDashboard,
  RefreshCw,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user as any;

  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/stats");
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      // handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <PageContainer>
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-border gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive text-destructive-foreground shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-extrabold font-heading text-foreground">
              Platform Administration
            </h1>
            <Badge variant="destructive" className="font-bold">
              Root Admin
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Signed in as: <strong className="text-foreground">{user?.email || "Admin"}</strong> • Complete platform oversight & moderation controls.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchStats}
          disabled={loading}
          className="rounded-xl font-semibold gap-2 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Metrics</span>
        </Button>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-2xl h-auto flex flex-wrap gap-1 w-full sm:w-auto">
          <TabsTrigger
            value="overview"
            className="rounded-xl px-5 py-2.5 font-bold text-xs gap-2 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm cursor-pointer"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Overview & Metrics</span>
          </TabsTrigger>

          <TabsTrigger
            value="users"
            className="rounded-xl px-5 py-2.5 font-bold text-xs gap-2 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm cursor-pointer"
          >
            <Users className="h-4 w-4" />
            <span>Manage Users</span>
          </TabsTrigger>

          <TabsTrigger
            value="menu"
            className="rounded-xl px-5 py-2.5 font-bold text-xs gap-2 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm cursor-pointer"
          >
            <Pizza className="h-4 w-4" />
            <span>Menu Moderation</span>
            {stats?.pendingMenuItems > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-extrabold">
                {stats.pendingMenuItems}
              </span>
            )}
          </TabsTrigger>

          <TabsTrigger
            value="transactions"
            className="rounded-xl px-5 py-2.5 font-bold text-xs gap-2 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm cursor-pointer"
          >
            <CreditCard className="h-4 w-4" />
            <span>Transactions Ledger</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="focus-visible:outline-none">
          <AdminOverviewTab stats={stats} loading={loading} />
        </TabsContent>

        {/* Tab 2: Users */}
        <TabsContent value="users" className="focus-visible:outline-none">
          <AdminUsersTab currentAdminEmail={user?.email} />
        </TabsContent>

        {/* Tab 3: Menu Moderation */}
        <TabsContent value="menu" className="focus-visible:outline-none">
          <AdminMenuItemsTab />
        </TabsContent>

        {/* Tab 4: Transactions */}
        <TabsContent value="transactions" className="focus-visible:outline-none">
          <AdminTransactionsTab />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
