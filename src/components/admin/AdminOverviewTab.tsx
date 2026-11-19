"use client";

import React from "react";
import { StatCard } from "@/components/shared/StatCard";
import { formatCurrency } from "@/lib/utils";
import {
  Users,
  Store,
  Pizza,
  Clock,
  DollarSign,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AdminOverviewTabProps {
  stats: {
    totalUsers: number;
    totalVendors: number;
    totalCustomers: number;
    totalAdmins: number;
    totalMenuItems: number;
    pendingMenuItems: number;
    approvedMenuItems: number;
    totalTransactions: number;
    totalRevenue: number;
    totalOrders: number;
  } | null;
  loading: boolean;
}

export function AdminOverviewTab({ stats, loading }: AdminOverviewTabProps) {
  const users = stats?.totalUsers || 0;
  const vendors = stats?.totalVendors || 0;
  const customers = stats?.totalCustomers || 0;
  const totalItems = stats?.totalMenuItems || 0;
  const pendingItems = stats?.pendingMenuItems || 0;
  const approvedItems = stats?.approvedMenuItems || 0;
  const revenue = stats?.totalRevenue || 0;
  const transactions = stats?.totalTransactions || 0;
  const orders = stats?.totalOrders || 0;

  // Percentage calculations
  const vendorPct = users > 0 ? Math.round((vendors / users) * 100) : 0;
  const customerPct = users > 0 ? Math.round((customers / users) * 100) : 0;
  const approvedPct = totalItems > 0 ? Math.round((approvedItems / totalItems) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Users"
          value={loading ? "--" : users}
          description={`${vendors} vendors, ${customers} customers`}
          icon={<Users className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="Total Vendors"
          value={loading ? "--" : vendors}
          description="Registered kitchens"
          icon={<Store className="h-5 w-5 text-orange-500" />}
        />
        <StatCard
          title="Customers"
          value={loading ? "--" : customers}
          description="Active pizza buyers"
          icon={<ShoppingBag className="h-5 w-5 text-amber-500" />}
        />
        <StatCard
          title="Menu Items"
          value={loading ? "--" : totalItems}
          description={`${approvedItems} approved active`}
          icon={<Pizza className="h-5 w-5 text-secondary" />}
        />
        <StatCard
          title="Pending Approvals"
          value={loading ? "--" : pendingItems}
          description="Awaiting moderation"
          icon={<Clock className="h-5 w-5 text-rose-500" />}
        />
        <StatCard
          title="Gross Revenue"
          value={loading ? "--" : formatCurrency(revenue)}
          description={`${transactions} Stripe subscriptions`}
          icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
        />
      </div>

      {/* Visual Platform Distribution & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Base Breakdown */}
        <Card className="rounded-3xl border border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold font-heading text-foreground flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>User Demographics</span>
              </span>
              <Badge variant="secondary" className="font-mono text-xs font-semibold">
                {users} Total Accounts
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Proportion of registered customers and partner pizzerias
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            {/* Multi-segment progress bar */}
            <div className="h-4 w-full rounded-full bg-muted overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${customerPct}%` }}
                className="bg-primary transition-all duration-500"
                title={`Customers: ${customerPct}%`}
              />
              <div
                style={{ width: `${vendorPct}%` }}
                className="bg-orange-500 transition-all duration-500"
                title={`Vendors: ${vendorPct}%`}
              />
              <div
                style={{ width: `${Math.max(2, 100 - customerPct - vendorPct)}%` }}
                className="bg-zinc-800 transition-all duration-500"
                title="Admins"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs pt-2">
              <div className="p-3 rounded-xl bg-muted/40 border border-border">
                <div className="flex items-center gap-1.5 font-bold text-primary">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <span>Customers</span>
                </div>
                <p className="text-base font-black font-heading text-foreground mt-1">
                  {customers} <span className="text-xs font-normal text-muted-foreground">({customerPct}%)</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border">
                <div className="flex items-center gap-1.5 font-bold text-orange-500">
                  <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                  <span>Vendors</span>
                </div>
                <p className="text-base font-black font-heading text-foreground mt-1">
                  {vendors} <span className="text-xs font-normal text-muted-foreground">({vendorPct}%)</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border">
                <div className="flex items-center gap-1.5 font-bold text-zinc-700">
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
                  <span>Admins</span>
                </div>
                <p className="text-base font-black font-heading text-foreground mt-1">
                  {stats?.totalAdmins || 1}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Catalog & Moderation Health */}
        <Card className="rounded-3xl border border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold font-heading text-foreground flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Pizza className="h-5 w-5 text-secondary" />
                <span>Menu Health & Approvals</span>
              </span>
              <Badge
                className={
                  pendingItems > 0
                    ? "bg-amber-500 text-white font-bold"
                    : "bg-emerald-600 text-white font-bold"
                }
              >
                {pendingItems > 0 ? `${pendingItems} Pending Action` : "Queue Clean"}
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Review status of artisan pizzas submitted by platform kitchens
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <div className="h-4 w-full rounded-full bg-muted overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${approvedPct}%` }}
                className="bg-emerald-600 transition-all duration-500"
                title={`Approved: ${approvedPct}%`}
              />
              <div
                style={{ width: `${100 - approvedPct}%` }}
                className="bg-amber-500 transition-all duration-500"
                title="Pending / Inactive"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  <span>Approved Live Items</span>
                </div>
                <p className="text-base font-black font-heading text-emerald-800 mt-1">
                  {approvedItems} / {totalItems} <span className="text-xs font-normal">({approvedPct}%)</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-1.5 font-bold text-amber-700">
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span>Pending Moderation</span>
                </div>
                <p className="text-base font-black font-heading text-amber-800 mt-1">
                  {pendingItems} <span className="text-xs font-normal">items waiting</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
