"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GatewayReportRow } from "@/app/api/reporting/_lib/types";
import { formatCurrency, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";

interface UserAttributionTableProps {
  data: GatewayReportRow[];
}

type SortKey = "user" | "request_count" | "total_cost" | "input_tokens" | "output_tokens" | "reasoning_tokens" | "avgCost";
type SortDir = "asc" | "desc";

function getVal(row: GatewayReportRow, key: SortKey): number | string {
  switch (key) {
    case "user": return row.user || "";
    case "request_count": return row.request_count;
    case "total_cost": return row.total_cost;
    case "input_tokens": return row.input_tokens;
    case "output_tokens": return row.output_tokens;
    case "reasoning_tokens": return row.reasoning_tokens;
    case "avgCost": return row.request_count > 0 ? row.total_cost / row.request_count : 0;
  }
}

function costHeatColor(cost: number, maxCost: number): string {
  if (maxCost === 0) return "";
  const ratio = cost / maxCost;
  if (ratio > 0.75) return "bg-red-500/15 text-red-400";
  if (ratio > 0.5) return "bg-amber-500/15 text-amber-400";
  if (ratio > 0.25) return "bg-yellow-500/10 text-yellow-400";
  return "";
}

export function UserAttributionTable({ data }: UserAttributionTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("total_cost");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const maxCost = Math.max(...data.map((r) => r.total_cost), 1);

  const sorted = [...data].sort((a, b) => {
    const aVal = getVal(a, sortKey);
    const bVal = getVal(b, sortKey);
    const cmp = typeof aVal === "string" ? aVal.localeCompare(bVal as string) : (aVal as number) - (bVal as number);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const header = (label: string, key: SortKey, align: "left" | "right" = "right") => (
    <TableHead
      className={cn("cursor-pointer select-none hover:text-foreground transition-colors", align === "right" && "text-right")}
      onClick={() => toggleSort(key)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown className={cn("h-3 w-3", sortKey === key ? "text-foreground" : "text-muted-foreground/50")} />
      </span>
    </TableHead>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">User Attribution</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {header("User", "user", "left")}
              {header("Requests", "request_count")}
              {header("Cost", "total_cost")}
              {header("Input Tokens", "input_tokens")}
              {header("Output Tokens", "output_tokens")}
              {header("Reasoning Tokens", "reasoning_tokens")}
              {header("Avg Cost/Req", "avgCost")}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((row) => {
              const avgCost = row.request_count > 0 ? row.total_cost / row.request_count : 0;
              return (
                <TableRow key={row.user} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{row.user}</TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatNumber(row.request_count)}
                  </TableCell>
                  <TableCell className={cn("text-right font-mono text-sm rounded", costHeatColor(row.total_cost, maxCost))}>
                    {formatCurrency(row.total_cost)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatNumber(row.input_tokens)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatNumber(row.output_tokens)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatNumber(row.reasoning_tokens)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    ${avgCost.toFixed(3)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
