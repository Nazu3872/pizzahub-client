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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface CustomerChartsProps {
  ordersChart: { name: string; count: number; fill: string }[];
}

export function CustomerOverviewCharts({ ordersChart }: CustomerChartsProps) {
  const hasOrders = ordersChart.some((d) => d.count > 0);

  return (
    <Card className="rounded-3xl border border-border shadow-sm my-8">
      <CardHeader>
        <CardTitle className="text-lg font-bold font-heading text-foreground">
          Order Status Activity
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Distribution of your current pizza deliveries and past orders
        </CardDescription>
      </CardHeader>
      <CardContent className="h-64 pt-2">
        {hasOrders ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ordersChart} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
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
                {ordersChart.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No orders placed yet. Choose a fresh pizza to see your order history chart!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
