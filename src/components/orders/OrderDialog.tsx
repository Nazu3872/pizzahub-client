"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingBag,
  Calendar,
  MapPin,
  MessageSquare,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  Loader2,
  Store,
  Phone,
} from "lucide-react";

interface OrderDialogProps {
  item: any;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDialog({ item, isOpen, onClose }: OrderDialogProps) {
  const router = useRouter();

  // Form states
  const todayStr = new Date().toISOString().split("T")[0];
  const [deliveryDate, setDeliveryDate] = useState(todayStr);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success state: step 2 shows "Proceed to Payment" button
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);
  const [isPaymentSimulating, setIsPaymentSimulating] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const resetForm = () => {
    setDeliveryDate(todayStr);
    setDeliveryAddress("");
    setPhone("");
    setMessage("");
    setPlacedOrder(null);
    setIsPaymentSimulating(false);
    setPaymentComplete(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!deliveryDate) {
      toast.error("Please pick a delivery date");
      return;
    }
    if (deliveryDate < todayStr) {
      toast.error("Delivery date cannot be in the past");
      return;
    }
    if (!deliveryAddress || deliveryAddress.trim().length < 3) {
      toast.error("Please enter a valid delivery address");
      return;
    }

    const finalPhone = phone.trim() || "01700000000";

    setIsSubmitting(true);
    try {
      const res = await api.post("/api/orders", {
        itemId: item.id || item._id,
        deliveryDate,
        deliveryAddress: deliveryAddress.trim(),
        phone: finalPhone,
        message: message.trim(),
      });

      if (res.success && res.data) {
        setPlacedOrder(res.data);
        toast.success("Order Placed Successfully!", {
          description: "Proceed to payment simulation to confirm your order.",
        });
      } else {
        toast.error("Failed to place order", {
          description: res.message || "An unexpected error occurred",
        });
      }
    } catch (err: any) {
      toast.error("Order Failed", {
        description: err.message || "Could not place order. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulates payment (strictly a button click, per assignment requirements)
  const handleProceedToPayment = () => {
    setIsPaymentSimulating(true);
    setTimeout(() => {
      setIsPaymentSimulating(false);
      setPaymentComplete(true);
      toast.success("Payment Confirmed!", {
        description: "Your pizza is queued in the kitchen for fresh baking.",
      });
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg p-6 sm:p-8 rounded-3xl max-h-[92vh] overflow-y-auto">
        {!placedOrder ? (
          // STEP 1: ORDER DETAILS FORM
          <>
            <DialogHeader className="border-b border-border pb-4">
              <DialogTitle className="text-2xl font-black font-heading text-foreground flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-primary" />
                <span>Place Your Pizza Order</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground pt-1">
                Freshly prepared and delivered straight to your doorstep.
              </DialogDescription>
            </DialogHeader>

            {/* Item Preview Card */}
            <div className="flex items-center gap-4 bg-muted/50 p-3.5 rounded-2xl border border-border my-2">
              <img
                src={item.images?.[0] || item.image}
                alt={item.itemName}
                className="h-16 w-16 rounded-xl object-cover border border-border shrink-0 shadow-xs"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-extrabold text-foreground truncate">
                  {item.itemName}
                </h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Store className="h-3 w-3 text-primary" />
                    <span className="truncate">{item.vendorName || "Artisan Kitchen"}</span>
                  </span>
                  <span>•</span>
                  <span className="font-bold text-primary">{formatCurrency(item.price)}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-4 pt-1">
              {/* Delivery Date */}
              <div className="space-y-1.5">
                <Label htmlFor="deliveryDate" className="text-xs font-bold flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>Delivery Date <span className="text-destructive">*</span></span>
                </Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  min={todayStr}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  required
                  className="rounded-xl font-medium"
                />
                <p className="text-[11px] text-muted-foreground">
                  Select today or any upcoming date for your delivery.
                </p>
              </div>

              {/* Delivery Address */}
              <div className="space-y-1.5">
                <Label htmlFor="deliveryAddress" className="text-xs font-bold flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-secondary" />
                  <span>Delivery Address <span className="text-destructive">*</span></span>
                </Label>
                <Textarea
                  id="deliveryAddress"
                  rows={2}
                  placeholder="Street address, apartment or house number, city (min 5 characters)"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  required
                  className="rounded-xl text-sm font-medium"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-bold flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Phone Number (Optional)</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g. +880 1700-000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-xl font-medium"
                />
                <p className="text-[11px] text-muted-foreground">
                  Rider will call this number on delivery.
                </p>
              </div>

              {/* Additional Message */}
              <div className="space-y-1.5">
                <Label htmlFor="message" className="text-xs font-bold flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Special Instructions (Optional)</span>
                </Label>
                <Textarea
                  id="message"
                  rows={2}
                  placeholder="e.g. Ring doorbell, extra spicy, call before delivery"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="rounded-xl font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl font-bold gap-2 shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      <span>Confirm & Place Order</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          // STEP 2: PROCEED TO PAYMENT (SIMULATED BUTTON ONLY)
          <div className="space-y-6 py-2 text-center">
            {!paymentComplete ? (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-inner">
                  <CreditCard className="h-8 w-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black font-heading text-foreground">
                    Order Placed Successfully!
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Your pizza order has been recorded in the system. Complete payment to finalize kitchen dispatch.
                  </p>
                </div>

                {/* Order Summary box */}
                <div className="bg-muted/50 p-4 rounded-2xl border border-border text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Item:</span>
                    <span className="font-bold text-foreground">{item.itemName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Date:</span>
                    <span className="font-semibold text-foreground">{deliveryDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Payable:</span>
                    <span className="font-extrabold text-primary text-sm">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-primary/5 rounded-xl border border-primary/15 text-[11px] text-muted-foreground text-left">
                  <strong>Secure checkout:</strong> Payment is collected on delivery. You can pay the rider in cash or card at your doorstep.
                </div>

                {/* THE MANDATED PROCEED TO PAYMENT BUTTON */}
                <Button
                  size="lg"
                  onClick={handleProceedToPayment}
                  disabled={isPaymentSimulating}
                  className="w-full py-6 text-base font-extrabold rounded-xl shadow-lg gap-2 cursor-pointer"
                >
                  {isPaymentSimulating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Confirming Payment...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      <span>Proceed to Payment</span>
                    </>
                  )}
                </Button>
              </>
            ) : (
              // STEP 3: PAYMENT CONFIRMED STATE
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-inner">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black font-heading text-emerald-600">
                    Payment Confirmed!
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Thank you! Your pizza is now in <strong>Pending Review</strong> status awaiting the artisan kitchen.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 rounded-xl font-semibold"
                  >
                    Keep Browsing
                  </Button>
                  <Button
                    onClick={() => {
                      handleClose();
                      router.push("/dashboard/customer/orders");
                    }}
                    className="flex-1 rounded-xl font-bold gap-2 shadow-md"
                  >
                    <span>View My Orders</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
