"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  PauseCircle,
  PlayCircle,
  Pizza,
  Store,
  MapPin,
  Loader2,
  Sparkles,
} from "lucide-react";

export function AdminMenuItemsTab() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Moderation state
  const [statusAction, setStatusAction] = useState<{ item: any; newStatus: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (categoryFilter !== "all") params.set("category", categoryFilter);

      const res = await api.get(`/api/admin/menu-items?${params.toString()}`);
      if (res.success && Array.isArray(res.data)) {
        setItems(res.data);
      }
    } catch (err: any) {
      toast.error("Failed to load menu items", {
        description: err.message || "Could not retrieve catalog.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchItems, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, categoryFilter]);

  const handleConfirmStatusChange = async () => {
    if (!statusAction) return;
    const { item, newStatus } = statusAction;

    setIsProcessing(true);
    try {
      const res = await api.patch(`/api/admin/menu-items/${item.id || item._id}/status`, {
        status: newStatus,
      });

      if (res.success) {
        toast.success(`Item ${newStatus}`, {
          description: `"${item.itemName}" status updated to ${newStatus}.`,
        });
        setStatusAction(null);
        fetchItems();
      } else {
        toast.error("Status Update Failed", { description: res.message });
      }
    } catch (err: any) {
      toast.error("Error", { description: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsProcessing(true);
    try {
      const res = await api.delete(`/api/admin/menu-items/${deleteTarget.id || deleteTarget._id}`);
      if (res.success) {
        toast.success("Menu Item Deleted", {
          description: `"${deleteTarget.itemName}" has been permanently removed.`,
        });
        setDeleteTarget(null);
        fetchItems();
      } else {
        toast.error("Deletion Failed", { description: res.message });
      }
    } catch (err: any) {
      toast.error("Error", { description: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-emerald-600 text-white font-bold">Approved / Live</Badge>;
      case "pending":
        return <Badge className="bg-amber-500 text-white font-bold animate-pulse">Pending Review</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="font-bold">Rejected</Badge>;
      case "inactive":
      default:
        return <Badge variant="secondary" className="font-bold">Inactive / Paused</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pizza items by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] rounded-xl font-medium">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] rounded-xl font-medium">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Classic Pizzas">Classic Pizzas</SelectItem>
              <SelectItem value="Vegetarian Pizzas">Vegetarian Pizzas</SelectItem>
              <SelectItem value="Meat Lovers">Meat Lovers</SelectItem>
              <SelectItem value="Specialty / Gourmet Pizzas">Specialty / Gourmet</SelectItem>
              <SelectItem value="Sides & Appetizers">Sides & Appetizers</SelectItem>
              <SelectItem value="Beverages & Desserts">Beverages & Desserts</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={fetchItems} className="rounded-xl font-semibold">
            Refresh
          </Button>
        </div>
      </div>

      {/* Items Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 bg-card border border-border rounded-xl flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl border border-border">
          <Pizza className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="text-lg font-bold text-foreground">No menu items match criteria</h3>
          <p className="text-xs text-muted-foreground mt-1">Try selecting another filter or clear your search.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold">Pizza Details</TableHead>
                  <TableHead className="font-bold">Vendor Kitchen</TableHead>
                  <TableHead className="font-bold">Price</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold text-right">Moderation Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const isPending = item.status === "pending";
                  const isApproved = item.status === "approved";
                  const isInactive = item.status === "inactive";

                  return (
                    <TableRow key={item.id || item._id} className="hover:bg-muted/30">
                      {/* Pizza info */}
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.images?.[0] || "https://images.unsplash.com/photo-1513104890138-7c749659a591"}
                            alt={item.itemName}
                            className="h-12 w-12 rounded-xl object-cover border border-border shrink-0"
                          />
                          <div>
                            <p className="font-bold text-foreground text-sm">{item.itemName}</p>
                            <Badge variant="outline" className="text-[10px] py-0 font-medium">
                              {item.category}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>

                      {/* Vendor */}
                      <TableCell className="text-xs">
                        <div className="flex items-center gap-1 font-semibold text-foreground">
                          <Store className="h-3 w-3 text-primary" />
                          <span>{item.vendor?.businessName || item.vendor?.name || "Kitchen"}</span>
                          {item.vendor?.subscriptionPlan === "premium" && (
                            <Badge className="bg-amber-500 text-white font-bold text-[9px] px-1 py-0 ml-1">
                              Pro
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground truncate max-w-[150px]">{item.vendor?.email}</p>
                      </TableCell>

                      {/* Price */}
                      <TableCell className="font-black font-heading text-primary text-sm">
                        {formatCurrency(item.price)}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        {renderStatusBadge(item.status)}
                      </TableCell>

                      {/* Moderation Controls */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => setStatusAction({ item, newStatus: "approved" })}
                                className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg gap-1 cursor-pointer"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Approve</span>
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setStatusAction({ item, newStatus: "rejected" })}
                                className="h-8 text-xs font-bold rounded-lg gap-1 cursor-pointer"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                <span>Reject</span>
                              </Button>
                            </>
                          )}

                          {isApproved && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setStatusAction({ item, newStatus: "inactive" })}
                              className="h-8 text-xs font-semibold rounded-lg gap-1 cursor-pointer"
                            >
                              <PauseCircle className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>Deactivate</span>
                            </Button>
                          )}

                          {isInactive && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setStatusAction({ item, newStatus: "approved" })}
                              className="h-8 text-xs font-semibold rounded-lg gap-1 text-emerald-600 hover:text-emerald-700 cursor-pointer"
                            >
                              <PlayCircle className="h-3.5 w-3.5" />
                              <span>Activate</span>
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTarget(item)}
                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-md p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-heading text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              <span>Delete Menu Item?</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
              Are you sure you want to permanently delete <strong>"{deleteTarget?.itemName}"</strong>? This will remove the pizza from public browsing and cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 border-t border-border gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isProcessing}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isProcessing}
              className="rounded-xl gap-2 font-bold"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Confirm Deletion</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog open={Boolean(statusAction)} onOpenChange={(open) => !open && setStatusAction(null)}>
        <DialogContent className="max-w-md p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-heading flex items-center gap-2">
              {statusAction?.newStatus === "approved" ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span>Approve & Publish Pizza?</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-destructive" />
                  <span>Update Pizza Status?</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
              Set status for <strong>"{statusAction?.item?.itemName}"</strong> to{" "}
              <strong>"{statusAction?.newStatus}"</strong>.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 border-t border-border gap-2">
            <Button
              variant="outline"
              onClick={() => setStatusAction(null)}
              disabled={isProcessing}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmStatusChange}
              disabled={isProcessing}
              className={`rounded-xl gap-2 font-bold ${
                statusAction?.newStatus === "approved"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : ""
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Confirm Status</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
