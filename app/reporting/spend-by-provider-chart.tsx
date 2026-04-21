"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GatewayReportRow } from "@/app/api/reporting/_lib/types";
import { formatCurrency } from "@/lib/format";

interface SpendByProviderChartProps {
  data: GatewayReportRow[];
}

const COLORS = [
  "oklch(0.488 0.243 264.376)",
  "oklch(0.696 0.17 162.48)",
  "oklch(0.769 0.188 70.08)",
  "oklch(0.627 0.265 303.9)",
];

export function SpendByProviderChart({ data }: SpendByProviderChartProps) {
  const total = data.reduce((sum, row) => sum + row.total_cost, 0);
  const chartData = data.map((row) => ({
    name: row.provider || "",
    value: row.total_cost,
    percent: ((row.total_cost / total) * 100).toFixed(1),
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Spend by Provider</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="relative">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value)), "Cost"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--popover-foreground))",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold">{formatCurrency(total)}</span>
              <span className="text-xs text-muted-foreground">total</span>
            </div>
          </div>
          <div className="space-y-3">
            {chartData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <div>
                  <div className="text-sm font-medium capitalize">{entry.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatCurrency(entry.value)} ({entry.percent}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
