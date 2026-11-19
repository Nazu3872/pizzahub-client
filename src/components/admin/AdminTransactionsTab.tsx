"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  CreditCard,
  Sparkles,
  Lock,
  Store,
  Calendar,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export function AdminTransactionsTab() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/transactions");
      if (res.success && Array.isArray(res.data)) {
        setTransactions(res.data);
      }
    } catch (err: any) {
      toast.error("Failed to load transactions", {
        description: err.message || "Could not retrieve ledger.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const totalRevenue = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header and Read-Only Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-5 rounded-2xl border border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
              <span>Financial Audit Ledger</span>
              <Badge variant="outline" className="text-xs font-mono gap-1 text-muted-foreground">
                <Lock className="h-3 w-3" /> Read-Only
              </Badge>
            </h3>
            <p className="text-xs text-muted-foreground">
              Total Recorded Revenue: <strong className="text-foreground">{formatCurrency(totalRevenue)}</strong> across {transactions.length} transactions.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchTransactions}
          className="rounded-xl font-semibold gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Ledger</span>
        </Button>
      </div>

      {/* Transactions Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-card border border-border rounded-xl flex items-center justify-between">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl border border-border">
          <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="text-lg font-bold text-foreground">No transactions recorded yet</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Transactions are generated automatically by verified Stripe webhooks when vendors upgrade to Premium ($29.00/mo).
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold">Transaction / Session ID</TableHead>
                  <TableHead className="font-bold">Vendor Kitchen</TableHead>
                  <TableHead className="font-bold">Plan</TableHead>
                  <TableHead className="font-bold">Amount</TableHead>
                  <TableHead className="font-bold">Date & Time</TableHead>
                  <TableHead className="font-bold text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id || tx._id} className="hover:bg-muted/30">
                    {/* Session ID */}
                    <TableCell className="py-3.5 font-mono text-xs text-muted-foreground">
                      <span className="bg-muted px-2 py-1 rounded-md text-foreground font-semibold">
                        {tx.stripeSessionId
                          ? `${tx.stripeSessionId.slice(0, 18)}...`
                          : tx.id?.slice(0, 12)}
                      </span>
                    </TableCell>

                    {/* Vendor */}
                    <TableCell className="text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-foreground">
                        <Store className="h-3.5 w-3.5 text-primary" />
                        <span>{tx.vendor?.businessName || tx.vendor?.name || "Artisan Kitchen"}</span>
                      </div>
                      <p className="text-muted-foreground truncate max-w-[150px]">{tx.vendor?.email}</p>
                    </TableCell>

                    {/* Plan */}
                    <TableCell>
                      <Badge className="bg-amber-500 text-white font-bold gap-1 text-[11px] capitalize">
                        <Sparkles className="h-2.5 w-2.5" />
                        <span>{tx.plan || "Premium"}</span>
                      </Badge>
                    </TableCell>

                    {/* Amount */}
                    <TableCell className="font-black font-heading text-emerald-600 text-sm">
                      {formatCurrency(tx.amount || 29.00)}
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {tx.createdAt
                            ? new Date(tx.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "N/A"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="text-right">
                      <Badge className="bg-emerald-600 text-white gap-1 font-bold">
                        <CheckCircle2 className="h-3 w-3" />
                        <span className="capitalize">{tx.status || "Completed"}</span>
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
