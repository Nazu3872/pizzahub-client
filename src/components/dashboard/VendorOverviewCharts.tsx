"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface VendorChartsProps {
  orderStatusChart: { name: string; count: number; fill: string }[];
  catalogChart: { name: string; count: number; fill: string }[];
}

export function VendorOverviewCharts({
  orderStatusChart,
  catalogChart,
}: VendorChartsProps) {
  const hasOrders = orderStatusChart.some((d) => d.count > 0);
  const hasCatalog = catalogChart.some((d) => d.count > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
      {/* Order Status Distribution Chart */}
      <Card className="rounded-3xl border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold font-heading text-foreground">
            Customer Orders Distribution
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Real-time incoming pizza order statuses for your kitchen
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64 pt-2">
          {hasOrders ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderStatusChart} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} stroke="#888888" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#888888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {orderStatusChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              No orders placed yet. As customers order, chart updates live.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Catalog Status Distribution Chart */}
      <Card className="rounded-3xl border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold font-heading text-foreground">
            Catalog Moderation Status
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Live overview of active, approved, and pending pizza recipes
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64 pt-2">
          {hasCatalog ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={catalogChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {catalogChart.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              No menu items created yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
