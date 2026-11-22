"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Store,
  Pizza,
  Sparkles,
  Edit,
  Trash2,
  Power,
  Eye,
  ShoppingBag,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  PauseCircle,
  ExternalLink,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { PageContainer } from "@/components/shared/PageContainer";
import { StatCard } from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddMenuItemDialog } from "@/components/vendor/AddMenuItemDialog";
import { EditMenuItemDialog } from "@/components/vendor/EditMenuItemDialog";
import { DeleteMenuItemDialog } from "@/components/vendor/DeleteMenuItemDialog";
import { VendorOverviewCharts } from "@/components/dashboard/VendorOverviewCharts";

export default function VendorDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const isPremium = user?.subscriptionPlan === "premium";

  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal dialog states
  const [editItem, setEditItem] = useState<any | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const [menuRes, statsRes] = await Promise.all([
        api.get("/vendor/menu-items"),
        api.get("/api/vendor/stats"),
      ]);
      if (menuRes.success && menuRes.data) {
        setItems(menuRes.data);
      }
      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (err: any) {
      toast.error("Failed to Load Menu", {
        description: err.message || "Could not retrieve your menu items.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Active items = status 'pending' or 'approved'
  const activeCount = items.filter(
    (i) => i.status === "pending" || i.status === "approved"
  ).length;

  const freeLimitReached = !isPremium && activeCount >= 3;

  const handleToggleAvailability = async (id: string, currentStatus: string) => {
    try {
      const res = await api.patch(`/vendor/menu-items/${id}/availability`);
      if (res.success) {
        toast.success(res.message || "Status updated");
        fetchItems();
      }
    } catch (err: any) {
      toast.error("Toggle Failed", {
        description: err.message || "Could not toggle availability.",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-600 text-white gap-1 hover:bg-emerald-700">
            <CheckCircle2 className="h-3 w-3" />
            <span>Active / Approved</span>
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500 text-white gap-1 hover:bg-amber-600">
            <Clock className="h-3 w-3" />
            <span>Pending Review</span>
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            <span>Rejected</span>
          </Badge>
        );
      case "inactive":
      default:
        return (
          <Badge variant="outline" className="gap-1 text-muted-foreground border-border">
            <PauseCircle className="h-3 w-3" />
            <span>Paused</span>
          </Badge>
        );
    }
  };

  return (
    <PageContainer>
      {/* Header Profile Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-border gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
              <Store className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-extrabold font-heading text-foreground">
              {user?.businessName || user?.name || "Kitchen Portal"}
            </h1>
            {isPremium ? (
              <Badge className="bg-amber-500 text-white font-bold gap-1 shadow-sm">
                <Sparkles className="h-3 w-3" /> Premium Partner
              </Badge>
            ) : (
              <Badge variant="secondary" className="font-semibold">
                Free Tier
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Manage your pizzeria's artisan catalog, stock availability, and menu items.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/vendor/orders">
            <Button variant="outline" className="rounded-xl font-bold gap-2 border-border shadow-xs cursor-pointer">
              <ShoppingBag className="h-4 w-4 text-primary" />
              <span>Customer Orders</span>
            </Button>
          </Link>
          <AddMenuItemDialog
            onItemAdded={fetchItems}
            disabled={freeLimitReached}
          />
        </div>
      </div>

      {/* Plan Limit Banner */}
      {!isPremium && (
        <div
          className={`mb-8 p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
            freeLimitReached
              ? "bg-amber-50 border-amber-300 text-amber-900"
              : "bg-card border-border text-foreground"
          }`}
        >
          <div className="flex items-start sm:items-center gap-3">
            <AlertCircle
              className={`h-5 w-5 shrink-0 ${
                freeLimitReached ? "text-amber-600" : "text-primary"
              }`}
            />
            <div>
              <p className="text-sm font-bold">
                Free Plan Capacity: {activeCount} / 3 Active Items Used
              </p>
              <p className="text-xs text-muted-foreground">
                {freeLimitReached
                  ? "You have reached the maximum 3 active items allowed on the Free Plan. Upgrade to list unlimited items!"
                  : "You can list up to 3 active items simultaneously on the Free Plan."}
              </p>
            </div>
          </div>

          <Link href="/dashboard/vendor/subscription">
            <Button size="sm" variant={freeLimitReached ? "default" : "outline"} className="gap-1.5 whitespace-nowrap shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Upgrade to Premium</span>
            </Button>
          </Link>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Catalog Items"
          value={items.length}
          description="All created pizzas & sides"
          icon={<Pizza className="h-5 w-5" />}
        />
        <StatCard
          title="Active in Menu"
          value={activeCount}
          description={isPremium ? "Unlimited plan" : "Max 3 active on Free tier"}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
        />
        <StatCard
          title="Pending Approvals"
          value={items.filter((i) => i.status === "pending").length}
          description="Awaiting admin review"
          icon={<Clock className="h-5 w-5 text-amber-500" />}
        />
        <StatCard
          title="Subscription"
          value={isPremium ? "Premium" : "Free"}
          description={isPremium ? "Unlimited catalog access" : "Upgrade anytime"}
          icon={<Sparkles className="h-5 w-5 text-secondary" />}
        />
      </div>

      {/* Visual Recharts Overview */}
      {stats && stats.orderStatusChart && stats.catalogChart && (
        <VendorOverviewCharts
          orderStatusChart={stats.orderStatusChart}
          catalogChart={stats.catalogChart}
        />
      )}

      {/* Menu Items Table */}
      <Card className="border-border/80 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 py-4 px-6 bg-muted/20">
          <div>
            <CardTitle className="text-lg font-bold font-heading">
              My Kitchen Menu
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live items currently registered under your vendor account
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              Loading menu catalog...
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-primary mb-3">
                <Pizza className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                No Menu Items Listed Yet
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
                Click "Add Menu Item" above to publish your first handcrafted artisan pizza!
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-[80px]">Photo</TableHead>
                  <TableHead>Item Details</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/40 transition-colors">
                    {/* Thumbnail */}
                    <TableCell>
                      <div className="h-12 w-12 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
                        {item.images?.[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.itemName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Pizza className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>

                    {/* Details */}
                    <TableCell>
                      <p className="font-bold text-foreground text-sm line-clamp-1">
                        {item.itemName}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                      <p className="text-[11px] text-muted-foreground/80 mt-1">
                        📍 {item.location}
                      </p>
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-accent text-accent-foreground">
                        {item.category}
                      </span>
                    </TableCell>

                    {/* Price */}
                    <TableCell>
                      <span className="font-extrabold text-primary text-sm font-heading">
                        {formatCurrency(item.price)}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell>{getStatusBadge(item.status)}</TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Availability Toggle */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          title={item.status === "inactive" ? "Activate item" : "Pause item"}
                          onClick={() => handleToggleAvailability(item.id, item.status)}
                        >
                          <Power className={`h-4 w-4 ${item.status === "inactive" ? "text-muted-foreground" : "text-emerald-600"}`} />
                        </Button>

                        {/* Edit Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="Edit item details"
                          onClick={() => {
                            setEditItem(item);
                            setEditOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          title="Delete item"
                          onClick={() => {
                            setDeleteItem(item);
                            setDeleteOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <EditMenuItemDialog
        item={editItem}
        open={editOpen}
        onOpenChange={setEditOpen}
        onItemUpdated={fetchItems}
      />

      {/* Delete Confirmation Modal */}
      <DeleteMenuItemDialog
        item={deleteItem}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onItemDeleted={fetchItems}
      />
    </PageContainer>
  );
}
