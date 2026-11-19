"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
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
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  Users,
  Store,
  Shield,
  Loader2,
  Sparkles,
} from "lucide-react";

interface AdminUsersTabProps {
  currentAdminEmail?: string;
}

export function AdminUsersTab({ currentAdminEmail }: AdminUsersTabProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Action state (block / unblock)
  const [actionTarget, setActionTarget] = useState<{ user: any; action: "block" | "unblock" } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (roleFilter !== "all") params.set("role", roleFilter);

      const res = await api.get(`/api/admin/users?${params.toString()}`);
      if (res.success && Array.isArray(res.data)) {
        setUsers(res.data);
      }
    } catch (err: any) {
      toast.error("Failed to load users", {
        description: err.message || "Could not retrieve user directory.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(delayTimer);
  }, [search, roleFilter]);

  const handleConfirmAction = async () => {
    if (!actionTarget) return;
    const { user, action } = actionTarget;

    setIsProcessing(true);
    try {
      const endpoint = `/api/admin/users/${user.id || user._id}/${action}`;
      const res = await api.patch(endpoint, {});

      if (res.success) {
        toast.success(
          action === "block" ? "User Blocked" : "User Unblocked",
          {
            description:
              action === "block"
                ? `${user.name} (${user.email}) has been immediately suspended.`
                : `${user.name} (${user.email}) access has been restored.`,
          }
        );
        setActionTarget(null);
        fetchUsers();
      } else {
        toast.error(`Action Failed`, {
          description: res.message || "Could not complete operation.",
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

  const renderRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="destructive" className="font-bold">Admin</Badge>;
      case "vendor":
        return <Badge className="bg-primary text-white font-bold">Vendor</Badge>;
      default:
        return <Badge variant="secondary" className="font-semibold">Customer</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name, email, or kitchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-3">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[160px] rounded-xl font-medium">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="customer">Customers</SelectItem>
              <SelectItem value="vendor">Vendors</SelectItem>
              <SelectItem value="admin">Administrators</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={fetchUsers}
            className="rounded-xl font-semibold"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 bg-card border border-border rounded-xl flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-60" />
              </div>
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl border border-border">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="text-lg font-bold text-foreground">No users found</h3>
          <p className="text-xs text-muted-foreground mt-1">Try adjusting your search query or filter.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold">User Identity</TableHead>
                  <TableHead className="font-bold">Role</TableHead>
                  <TableHead className="font-bold">Plan / Kitchen</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold text-right">Moderation Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => {
                  const isCurrentAdmin = u.email === currentAdminEmail;
                  const isAnyAdmin = u.role === "admin";
                  const isBlocked = u.isBlocked === true;

                  return (
                    <TableRow key={u.id || u._id} className="hover:bg-muted/30">
                      {/* Identity */}
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {u.name ? u.name.slice(0, 2) : "US"}
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isCurrentAdmin && (
                                <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.2 rounded-md">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Role */}
                      <TableCell>
                        {renderRoleBadge(u.role)}
                      </TableCell>

                      {/* Plan / Kitchen */}
                      <TableCell className="text-xs">
                        {u.role === "vendor" ? (
                          <div>
                            <span className="font-semibold text-foreground block">
                              {u.businessName || "Artisan Kitchen"}
                            </span>
                            <span className="text-muted-foreground flex items-center gap-1 mt-0.5">
                              {u.subscriptionPlan === "premium" ? (
                                <Badge className="bg-amber-500 text-white font-bold text-[10px] py-0">
                                  <Sparkles className="h-2.5 w-2.5 mr-0.5" /> Premium
                                </Badge>
                              ) : (
                                <span>Free Tier</span>
                              )}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Standard Member</span>
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        {isBlocked ? (
                          <Badge variant="destructive" className="gap-1 font-bold">
                            <ShieldAlert className="h-3 w-3" />
                            <span>Suspended</span>
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-600 text-white gap-1 font-bold">
                            <ShieldCheck className="h-3 w-3" />
                            <span>Active</span>
                          </Badge>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        {isAnyAdmin ? (
                          <span className="text-xs text-muted-foreground italic pr-2">
                            Admin Protected
                          </span>
                        ) : isBlocked ? (
                          <Button
                            size="sm"
                            onClick={() => setActionTarget({ user: u, action: "unblock" })}
                            className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg gap-1.5 cursor-pointer"
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                            <span>Unblock</span>
                          </Button>
                        ) : (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setActionTarget({ user: u, action: "block" })}
                            className="h-8 text-xs font-bold rounded-lg gap-1.5 cursor-pointer"
                          >
                            <UserX className="h-3.5 w-3.5" />
                            <span>Block User</span>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={Boolean(actionTarget)} onOpenChange={(open) => !open && setActionTarget(null)}>
        <DialogContent className="max-w-md p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-heading flex items-center gap-2">
              {actionTarget?.action === "block" ? (
                <>
                  <ShieldAlert className="h-5 w-5 text-destructive" />
                  <span>Block User Account?</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <span>Unblock User Account?</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
              {actionTarget?.action === "block"
                ? `Blocking ${actionTarget?.user?.name} (${actionTarget?.user?.email}) takes effect immediately across all protected APIs and terminates active sessions.`
                : `Unblocking ${actionTarget?.user?.name} (${actionTarget?.user?.email}) will restore standard system and ordering access immediately.`}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 border-t border-border gap-2">
            <Button
              variant="outline"
              onClick={() => setActionTarget(null)}
              disabled={isProcessing}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant={actionTarget?.action === "block" ? "destructive" : "default"}
              onClick={handleConfirmAction}
              disabled={isProcessing}
              className={`rounded-xl gap-2 font-bold ${
                actionTarget?.action === "unblock" ? "bg-emerald-600 hover:bg-emerald-700" : ""
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Confirm {actionTarget?.action === "block" ? "Suspension" : "Restoration"}</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
