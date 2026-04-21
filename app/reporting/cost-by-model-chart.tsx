"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GatewayReportRow } from "@/app/api/reporting/_lib/types";
import { shortModelName } from "@/lib/format";

interface CostByModelChartProps {
  data: GatewayReportRow[];
}

const formatDollar = (v: number) => `$${(v / 1000).toFixed(1)}K`;

export function CostByModelChart({ data }: CostByModelChartProps) {
  const chartData = data.map((row) => ({
    name: shortModelName(row.model || ""),
    charged: row.total_cost,
    market: row.market_cost,
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Cost by Model</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tickFormatter={formatDollar}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <Tooltip
              formatter={(value, name) => [
                `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                name === "charged" ? "Charged Cost" : "Market Cost",
              ]}
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--popover-foreground))",
              }}
            />
            <Legend
              formatter={(value) => (value === "charged" ? "Charged Cost" : "Market Cost")}
            />
            <Bar
              dataKey="charged"
              fill="oklch(0.488 0.243 264.376)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="market"
              fill="oklch(0.488 0.243 264.376 / 0.35)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
