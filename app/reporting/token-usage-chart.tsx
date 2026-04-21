"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GatewayReportRow } from "@/app/api/reporting/_lib/types";
import { formatNumber } from "@/lib/format";
import { format, parseISO } from "date-fns";

interface TokenUsageChartProps {
  data: GatewayReportRow[];
}

export function TokenUsageChart({ data }: TokenUsageChartProps) {
  const chartData = data
    .filter((row) => row.day)
    .sort((a, b) => (a.day! > b.day! ? 1 : -1))
    .map((row) => ({
      date: format(parseISO(row.day!), "MMM d"),
      input: row.input_tokens,
      output: row.output_tokens,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Token Usage — Daily</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="gradInput" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.488 0.243 264.376)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="oklch(0.488 0.243 264.376)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradOutput" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.696 0.17 162.48)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="oklch(0.696 0.17 162.48)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tickFormatter={(v) => formatNumber(v)}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <Tooltip
              formatter={(value, name) => [
                formatNumber(Number(value)),
                name === "input" ? "Input Tokens" : "Output Tokens",
              ]}
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--popover-foreground))",
              }}
            />
            <Legend
              formatter={(value) => (value === "input" ? "Input Tokens" : "Output Tokens")}
            />
            <Area
              type="monotone"
              dataKey="input"
              stroke="oklch(0.488 0.243 264.376)"
              fill="url(#gradInput)"
              strokeWidth={2}
              stackId="1"
            />
            <Area
              type="monotone"
              dataKey="output"
              stroke="oklch(0.696 0.17 162.48)"
              fill="url(#gradOutput)"
              strokeWidth={2}
              stackId="1"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
