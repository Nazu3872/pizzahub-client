"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { PageContainer } from "@/components/shared/PageContainer";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderDetailsDialog } from "@/components/orders/OrderDetailsDialog";
import {
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Eye,
  Calendar,
  MapPin,
  User,
  Loader2,
  Pizza,
  ArrowLeft,
  Store,
} from "lucide-react";

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected order for details view
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Action states
  const [actionOrder, setActionOrder] = useState<{ order: any; action: "accept" | "reject" } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/orders/vendor");
      if (res.success && Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch (err: any) {
      toast.error("Failed to load customer orders", {
        description: err.message || "Could not retrieve incoming orders.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleConfirmAction = async () => {
    if (!actionOrder) return;
    const { order, action } = actionOrder;

    setIsProcessing(true);
    try {
      const endpoint = `/api/orders/${order.id || order._id}/${action}`;
      const res = await api.patch(endpoint);

      if (res.success) {
        toast.success(
          action === "accept" ? "Order Accepted!" : "Order Rejected",
          {
            description:
              action === "accept"
                ? `Order for ${order.item?.itemName} is marked accepted. Start baking!`
                : `Order has been declined.`,
          }
        );
        setActionOrder(null);
        fetchOrders();
      } else {
        toast.error(`Action Failed`, {
          description: res.message || `Could not ${action} order.`,
        });
      }
    } catch (err: any) {
      toast.error("Error", {
        description: err.message || "An unexpected error occurred.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-emerald-600 text-white font-bold">Accepted</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="font-bold">Rejected</Badge>;
      case "cancelled":
        return <Badge variant="secondary" className="font-bold">Cancelled by Customer</Badge>;
      default:
        return <Badge className="bg-amber-500 text-white font-bold animate-pulse">Pending Review</Badge>;
    }
  };

  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-border">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link
              href="/dashboard/vendor"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-extrabold font-heading text-foreground">
              Customer Orders
            </h1>
            {pendingCount > 0 && (
              <Badge className="bg-amber-500 text-white font-bold">
                {pendingCount} Pending
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Manage incoming pizza requests, confirm preparation, or decline orders.
          </p>
        </div>

        <Link href="/dashboard/vendor">
          <Button variant="outline" className="rounded-xl font-semibold gap-2">
            <Store className="h-4 w-4 text-primary" />
            <span>Manage Menu Catalog</span>
          </Button>
        </Link>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 bg-card border border-border rounded-2xl flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="h-8 w-8 text-primary" />}
          title="No customer orders yet"
          description="When customers order your pizzas from the menu catalog, they will appear here in real-time."
          actionText="View Menu Items"
          onAction={() => {
            window.location.href = "/dashboard/vendor";
          }}
        />
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold">Customer</TableHead>
                  <TableHead className="font-bold">Pizza Item</TableHead>
                  <TableHead className="font-bold">Delivery Date</TableHead>
                  <TableHead className="font-bold">Address</TableHead>
                  <TableHead className="font-bold">Amount</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const isPending = order.status === "pending";
                  return (
                    <TableRow key={order.id || order._id} className="hover:bg-muted/30">
                      {/* Customer Info */}
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {order.customer?.name ? order.customer.name.slice(0, 2) : "CU"}
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm">
                              {order.customer?.name || "Customer"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                              {order.customer?.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Pizza Item */}
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <img
                            src={order.item?.images?.[0] || order.item?.image || "https://images.unsplash.com/photo-1513104890138-7c749659a591"}
                            alt={order.item?.itemName || "Pizza"}
                            className="h-10 w-10 rounded-lg object-cover border border-border shrink-0"
                          />
                          <span className="font-semibold text-foreground text-sm truncate max-w-[160px]">
                            {order.item?.itemName || "Pizza Item"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Delivery Date */}
                      <TableCell className="text-sm font-medium">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          <span>{order.deliveryDate}</span>
                        </div>
                      </TableCell>

                      {/* Address */}
                      <TableCell className="text-xs text-muted-foreground max-w-[180px] truncate">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="h-3.5 w-3.5 text-secondary shrink-0" />
                          <span className="truncate">{order.deliveryAddress}</span>
                        </div>
                      </TableCell>

                      {/* Price */}
                      <TableCell className="font-black font-heading text-primary text-sm">
                        {formatCurrency(order.totalPrice || order.item?.price || 0)}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        {renderStatusBadge(order.status)}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsDetailsOpen(true);
                            }}
                            className="h-8 gap-1.5 text-xs rounded-lg cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Details</span>
                          </Button>

                          {isPending && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => setActionOrder({ order, action: "accept" })}
                                className="h-8 gap-1 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 font-bold text-white shadow-xs cursor-pointer"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Accept</span>
                              </Button>

                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setActionOrder({ order, action: "reject" })}
                                className="h-8 gap-1 text-xs rounded-lg font-bold cursor-pointer"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                <span>Reject</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Order Details Dialog with Status Timeline */}
      <OrderDetailsDialog
        order={selectedOrder}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedOrder(null);
        }}
      />

      {/* Action Confirmation Dialog (Accept or Reject) */}
      <Dialog open={Boolean(actionOrder)} onOpenChange={(open) => !open && setActionOrder(null)}>
        <DialogContent className="max-w-md p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-heading flex items-center gap-2">
              {actionOrder?.action === "accept" ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span>Accept Customer Order?</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-rose-600" />
                  <span>Reject Customer Order?</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              {actionOrder?.action === "accept"
                ? `Confirming this order for ${actionOrder?.order?.customer?.name} locks in the delivery on ${actionOrder?.order?.deliveryDate}.`
                : `Are you sure you want to decline this order for ${actionOrder?.order?.customer?.name}?`}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 border-t border-border gap-2">
            <Button
              variant="outline"
              onClick={() => setActionOrder(null)}
              disabled={isProcessing}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant={actionOrder?.action === "accept" ? "default" : "destructive"}
              onClick={handleConfirmAction}
              disabled={isProcessing}
              className={`rounded-xl gap-2 font-bold ${
                actionOrder?.action === "accept" ? "bg-emerald-600 hover:bg-emerald-700" : ""
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Confirm {actionOrder?.action === "accept" ? "Acceptance" : "Rejection"}</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
