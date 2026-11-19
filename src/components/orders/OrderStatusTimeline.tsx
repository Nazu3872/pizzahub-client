"use client";

import React from "react";
import { CheckCircle2, Clock, XCircle, AlertCircle, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderStatusTimelineProps {
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt?: string | Date;
  updatedAt?: string | Date;
  className?: string;
}

export function OrderStatusTimeline({
  status,
  createdAt,
  updatedAt,
  className,
}: OrderStatusTimelineProps) {
  const isPending = status === "pending";
  const isAccepted = status === "accepted";
  const isRejected = status === "rejected";
  const isCancelled = status === "cancelled";

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative flex items-center justify-between">
        {/* Connector line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-border -z-0">
          <div
            className={cn(
              "h-full transition-all duration-500",
              isAccepted
                ? "w-full bg-emerald-500"
                : isRejected || isCancelled
                ? "w-full bg-rose-500"
                : "w-1/2 bg-amber-500"
            )}
          />
        </div>

        {/* Step 1: Placed */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-md border-2 border-background">
            <Clock className="h-5 w-5" />
          </div>
          <span className="mt-2 text-xs font-bold text-foreground">Order Placed</span>
          <span className="text-[10px] text-muted-foreground">Pending Review</span>
        </div>

        {/* Step 2: Kitchen Decision */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {isAccepted ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md border-2 border-background">
              <ChefHat className="h-5 w-5" />
            </div>
          ) : isRejected ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-600 text-white shadow-md border-2 border-background">
              <XCircle className="h-5 w-5" />
            </div>
          ) : isCancelled ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-500 text-white shadow-md border-2 border-background">
              <AlertCircle className="h-5 w-5" />
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground border-2 border-border">
              <ChefHat className="h-5 w-5" />
            </div>
          )}

          <span
            className={cn(
              "mt-2 text-xs font-bold",
              isAccepted
                ? "text-emerald-600"
                : isRejected
                ? "text-rose-600"
                : isCancelled
                ? "text-zinc-600"
                : "text-muted-foreground"
            )}
          >
            {isAccepted
              ? "Accepted"
              : isRejected
              ? "Rejected"
              : isCancelled
              ? "Cancelled"
              : "Kitchen Decision"}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {isAccepted
              ? "Preparing Pizza"
              : isRejected
              ? "Order Declined"
              : isCancelled
              ? "Cancelled by You"
              : "Awaiting Chef"}
          </span>
        </div>

        {/* Step 3: Delivery Status */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {isAccepted ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md border-2 border-background">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          ) : isRejected || isCancelled ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground border-2 border-border opacity-50">
              <XCircle className="h-5 w-5" />
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground border-2 border-border">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          )}

          <span
            className={cn(
              "mt-2 text-xs font-bold",
              isAccepted ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Hot & Fresh
          </span>
          <span className="text-[10px] text-muted-foreground">
            {isAccepted
              ? "On Schedule"
              : isRejected || isCancelled
              ? "Terminated"
              : "Final Delivery"}
          </span>
        </div>
      </div>
    </div>
  );
}
