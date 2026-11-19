"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { PageContainer } from "@/components/shared/PageContainer";
import { SectionHeading } from "@/components/shared/SectionHeading";
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
  Clock,
  Eye,
  XCircle,
  Calendar,
  MapPin,
  Store,
  Loader2,
  Pizza,
} from "lucide-react";

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected order for details view
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Cancel dialog state
  const [orderToCancel, setOrderToCancel] = useState<any | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/orders/customer");
      if (res.success && Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch (err: any) {
      toast.error("Failed to load orders", {
        description: err.message || "Could not retrieve your orders.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!orderToCancel) return;
    setIsCancelling(true);
    try {
      const res = await api.patch(`/api/orders/${orderToCancel.id || orderToCancel._id}/cancel`);
      if (res.success) {
        toast.success("Order Cancelled", {
          description: "Your pending order has been cancelled successfully.",
        });
        setOrderToCancel(null);
        fetchOrders();
      } else {
        toast.error("Cancellation Failed", {
          description: res.message || "Could not cancel order.",
        });
      }
    } catch (err: any) {
      toast.error("Error", {
        description: err.message || "An unexpected error occurred.",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-emerald-600 text-white font-bold">Accepted</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="font-bold">Rejected</Badge>;
      case "cancelled":
        return <Badge variant="secondary" className="font-bold">Cancelled</Badge>;
      default:
        return <Badge className="bg-amber-500 text-white font-bold">Pending</Badge>;
    }
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-extrabold font-heading text-foreground">
              My Pizza Orders
            </h1>
            <Badge variant="secondary" className="font-semibold">
              {orders.length} {orders.length === 1 ? "Order" : "Orders"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Track real-time status, review order history, and manage your deliveries.
          </p>
        </div>

        <Link href="/menu">
          <Button className="rounded-xl font-bold gap-2 shadow-sm">
            <ShoppingBag className="h-4 w-4" />
            <span>Order Another Pizza</span>
          </Button>
        </Link>
      </div>

      {/* Orders List */}
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
          icon={<Pizza className="h-8 w-8 text-primary" />}
          title="No pizza orders yet!"
          description="You haven't placed any pizza orders. Browse our artisan menu and order your favorite slice today."
          actionText="Browse Menu"
          onAction={() => {
            window.location.href = "/menu";
          }}
        />
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold">Pizza & Kitchen</TableHead>
                  <TableHead className="font-bold">Delivery Date</TableHead>
                  <TableHead className="font-bold">Address</TableHead>
                  <TableHead className="font-bold">Total Price</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const isPending = order.status === "pending";
                  return (
                    <TableRow key={order.id || order._id} className="hover:bg-muted/30">
                      {/* Pizza & Kitchen */}
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={order.item?.images?.[0] || order.item?.image || "https://images.unsplash.com/photo-1513104890138-7c749659a591"}
                            alt={order.item?.itemName || "Pizza"}
                            className="h-12 w-12 rounded-xl object-cover border border-border shrink-0"
                          />
                          <div>
                            <p className="font-extrabold text-foreground text-sm">
                              {order.item?.itemName || "Artisan Pizza"}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Store className="h-3 w-3 text-primary" />
                              <span>{order.vendor?.businessName || "Artisan Kitchen"}</span>
                            </p>
                          </div>
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
                      <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
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
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDetails(order)}
                            className="h-8 gap-1.5 text-xs rounded-lg cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Details</span>
                          </Button>

                          {isPending && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setOrderToCancel(order)}
                              className="h-8 gap-1.5 text-xs rounded-lg cursor-pointer"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              <span>Cancel</span>
                            </Button>
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

      {/* Cancel Confirmation Dialog */}
      <Dialog open={Boolean(orderToCancel)} onOpenChange={(open) => !open && setOrderToCancel(null)}>
        <DialogContent className="max-w-md p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-heading text-destructive flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              <span>Cancel Pizza Order?</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              Are you sure you want to cancel your order for{" "}
              <strong>{orderToCancel?.item?.itemName || "this pizza"}</strong> scheduled for delivery on{" "}
              <strong>{orderToCancel?.deliveryDate}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 border-t border-border gap-2">
            <Button
              variant="outline"
              onClick={() => setOrderToCancel(null)}
              disabled={isCancelling}
              className="rounded-xl"
            >
              Keep Order
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={isCancelling}
              className="rounded-xl gap-2 font-bold"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Cancelling...</span>
                </>
              ) : (
                <span>Confirm Cancellation</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
