"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusTimeline } from "./OrderStatusTimeline";
import { MapPin, Calendar, Store, MessageSquare, DollarSign, Clock, Phone } from "lucide-react";

interface OrderDetailsDialogProps {
  order: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailsDialog({
  order,
  isOpen,
  onClose,
}: OrderDetailsDialogProps) {
  if (!order) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-emerald-600 text-white font-bold">Accepted</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="font-bold">Rejected</Badge>;
      case "cancelled":
        return <Badge variant="secondary" className="font-bold">Cancelled</Badge>;
      default:
        return <Badge className="bg-amber-500 text-white font-bold">Pending Review</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-6 sm:p-8 rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="text-xl font-extrabold font-heading text-foreground">
              Order Details
            </DialogTitle>
            {getStatusBadge(order.status)}
          </div>
          <DialogDescription className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
            <Clock className="h-3.5 w-3.5" />
            <span>ID: {order.id || order._id}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Status Timeline */}
        <div className="py-2 border-b border-border">
          <OrderStatusTimeline
            status={order.status}
            createdAt={order.createdAt}
            updatedAt={order.updatedAt}
          />
        </div>

        {/* Item Summary */}
        <div className="flex items-center gap-4 py-4 border-b border-border bg-muted/40 p-3 rounded-xl">
          {order.item?.images?.[0] || order.item?.image ? (
            <img
              src={order.item?.images?.[0] || order.item?.image}
              alt={order.item?.itemName || "Pizza"}
              className="h-16 w-16 rounded-lg object-cover border border-border shrink-0"
            />
          ) : (
            <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
              PIZZA
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-bold text-foreground truncate">
              {order.item?.itemName || "Artisan Pizza"}
            </h4>
            <p className="text-xs text-muted-foreground">{order.item?.category || "Specialty Pizza"}</p>
            <p className="text-sm font-extrabold text-primary pt-1">
              {formatCurrency(order.totalPrice || order.item?.price || 0)}
            </p>
          </div>
        </div>

        {/* Delivery & Vendor Information */}
        <div className="space-y-3 py-2 text-sm">
          <div className="flex items-start gap-2.5 text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground block text-xs">Delivery Date:</span>
              <span className="text-foreground">{order.deliveryDate}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-muted-foreground">
            <MapPin className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground block text-xs">Delivery Address:</span>
              <span className="text-foreground">{order.deliveryAddress}</span>
            </div>
          </div>

          {order.phone && (
            <div className="flex items-start gap-2.5 text-muted-foreground">
              <Phone className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground block text-xs">Contact Phone:</span>
                <a href={`tel:${order.phone}`} className="text-foreground hover:text-primary">
                  {order.phone}
                </a>
              </div>
            </div>
          )}

          {order.vendor?.businessName && (
            <div className="flex items-start gap-2.5 text-muted-foreground">
              <Store className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground block text-xs">Kitchen / Vendor:</span>
                <span className="text-foreground">{order.vendor.businessName}</span>
              </div>
            </div>
          )}

          {order.customer?.name && (
            <div className="flex items-start gap-2.5 text-muted-foreground">
              <Store className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground block text-xs">Customer Name:</span>
                <span className="text-foreground">{order.customer.name} ({order.customer.email})</span>
              </div>
            </div>
          )}

          {order.message && (
            <div className="flex items-start gap-2.5 text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border">
              <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground block text-xs">Special Instructions:</span>
                <span className="text-foreground text-xs italic">"{order.message}"</span>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
