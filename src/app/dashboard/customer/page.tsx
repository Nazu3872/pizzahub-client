"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { PageContainer } from "@/components/shared/PageContainer";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { CustomerOverviewCharts } from "@/components/dashboard/CustomerOverviewCharts";
import {
  ShoppingBag,
  Clock,
  ShieldCheck,
  ArrowRight,
  Pizza,
  Calendar,
  CheckCircle2,
  XCircle,
  DollarSign,
} from "lucide-react";

export default function CustomerDashboard() {
  const { data: session } = useSession();
  const user = session?.user as any;

  const [stats, setStats] = useState<any | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [statsRes, ordersRes] = await Promise.all([
          api.get("/api/customer/stats"),
          api.get("/api/orders/customer"),
        ]);

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }
        if (ordersRes.success && Array.isArray(ordersRes.data)) {
          setRecentOrders(ordersRes.data.slice(0, 4));
        }
      } catch (err) {
        // silent fail
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalOrders = stats?.totalOrders || 0;
  const pendingOrders = stats?.pendingOrders || 0;
  const acceptedOrders = stats?.acceptedOrders || 0;
  const rejectedOrders = stats?.rejectedOrders || 0;
  const totalSpent = stats?.totalSpent || 0;

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-border gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-extrabold font-heading text-foreground">
              Customer Dashboard
            </h1>
            <Badge variant="secondary">Customer</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Welcome back, <span className="font-semibold text-foreground">{user?.name || "Pizza Lover"}</span>! Track your pizza orders in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/menu">
            <Button variant="outline" className="rounded-xl font-semibold">
              Browse Menu
            </Button>
          </Link>
          <Link href="/dashboard/customer/orders">
            <Button className="rounded-xl font-bold gap-2 shadow-md">
              <ShoppingBag className="h-4 w-4" />
              <span>My Orders ({totalOrders})</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Real Aggregated Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="Total Orders"
          value={loading ? "--" : totalOrders}
          description="Pizzas ordered to date"
          icon={<ShoppingBag className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="Pending Review"
          value={loading ? "--" : pendingOrders}
          description="Awaiting kitchen confirmation"
          icon={<Clock className="h-5 w-5 text-amber-500" />}
        />
        <StatCard
          title="Accepted & Baking"
          value={loading ? "--" : acceptedOrders}
          description="In the kitchen oven"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
        />
        <StatCard
          title="Rejected"
          value={loading ? "--" : rejectedOrders}
          description="Declined by kitchen"
          icon={<XCircle className="h-5 w-5 text-rose-500" />}
        />
        <StatCard
          title="Total Spent"
          value={loading ? "--" : formatCurrency(totalSpent)}
          description="Simulated pizza payments"
          icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
        />
      </div>

      {/* Interactive Recharts Graph */}
      {stats?.ordersChart && (
        <CustomerOverviewCharts ordersChart={stats.ordersChart} />
      )}

      {/* Recent Activity */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
          <h3 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>Recent Orders</span>
          </h3>
          <Link
            href="/dashboard/customer/orders"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <p className="text-xs text-muted-foreground py-4">Loading your orders...</p>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <p className="text-sm text-muted-foreground">No recent orders found.</p>
            <Link href="/menu">
              <Button size="sm" className="rounded-xl font-bold">
                Order Your First Pizza
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id || order._id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 hover:bg-muted/70 transition-colors border border-border/60"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={order.item?.images?.[0] || order.item?.image || "https://images.unsplash.com/photo-1513104890138-7c749659a591"}
                    alt={order.item?.itemName}
                    className="h-10 w-10 rounded-xl object-cover"
                  />
                  <div>
                    <p className="font-bold text-sm text-foreground">{order.item?.itemName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Delivery: {order.deliveryDate}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-primary text-sm">
                    {formatCurrency(order.totalPrice || order.item?.price || 0)}
                  </span>
                  <div className="pt-0.5">
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
