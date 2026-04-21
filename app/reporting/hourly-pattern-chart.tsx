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

interface HourlyPatternChartProps {
  data: GatewayReportRow[];
}

function formatHour(hour: string): string {
  const h = parseInt(hour, 10);
  if (h === 0) return "12am";
  if (h === 12) return "12pm";
  return h < 12 ? `${h}am` : `${h - 12}pm`;
}

export function HourlyPatternChart({ data }: HourlyPatternChartProps) {
  const chartData = data
    .filter((row) => row.hour != null)
    .sort((a, b) => parseInt(a.hour!) - parseInt(b.hour!))
    .map((row) => ({
      hour: formatHour(row.hour!),
      input: row.input_tokens,
      output: row.output_tokens,
      requests: row.request_count,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Hourly Pattern — Most Recent Day
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="gradHourInput" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.769 0.188 70.08)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="oklch(0.769 0.188 70.08)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradHourOutput" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.627 0.265 303.9)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="oklch(0.627 0.265 303.9)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="hour"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              interval={2}
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
              stroke="oklch(0.769 0.188 70.08)"
              fill="url(#gradHourInput)"
              strokeWidth={2}
              stackId="1"
            />
            <Area
              type="monotone"
              dataKey="output"
              stroke="oklch(0.627 0.265 303.9)"
              fill="url(#gradHourOutput)"
              strokeWidth={2}
              stackId="1"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
