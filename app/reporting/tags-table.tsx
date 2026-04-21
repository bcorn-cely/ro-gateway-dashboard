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
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";

interface TagsTableProps {
  data: GatewayReportRow[];
}

type SortKey = "tag" | "request_count" | "total_cost" | "market_cost" | "tokens" | "avgTokens" | "cacheHitRate";
type SortDir = "asc" | "desc";

function getVal(row: GatewayReportRow, key: SortKey): number | string {
  switch (key) {
    case "tag": return row.tag || "";
    case "request_count": return row.request_count;
    case "total_cost": return row.total_cost;
    case "market_cost": return row.market_cost;
    case "tokens": return row.input_tokens + row.output_tokens;
    case "avgTokens": return row.request_count > 0 ? (row.input_tokens + row.output_tokens) / row.request_count : 0;
    case "cacheHitRate": return row.input_tokens > 0 ? row.cached_input_tokens / row.input_tokens : 0;
  }
}

export function TagsTable({ data }: TagsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("total_cost");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const maxRequests = Math.max(...data.map((r) => r.request_count), 1);

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
        <CardTitle className="text-base font-semibold">Tags Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {header("Tag", "tag", "left")}
              {header("Requests", "request_count")}
              {header("Cost", "total_cost")}
              {header("Market Cost", "market_cost")}
              {header("Tokens", "tokens")}
              {header("Avg Tokens/Req", "avgTokens")}
              {header("Cache Hit", "cacheHitRate")}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((row) => {
              const tokens = row.input_tokens + row.output_tokens;
              const avg = row.request_count > 0 ? tokens / row.request_count : 0;
              const hitRate = row.input_tokens > 0 ? row.cached_input_tokens / row.input_tokens : 0;
              const barWidth = (row.request_count / maxRequests) * 100;

              return (
                <TableRow key={row.tag} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{row.tag}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-mono text-sm">{formatNumber(row.request_count)}</span>
                      <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-chart-1 rounded-full" style={{ width: `${barWidth}%` }} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">{formatCurrency(row.total_cost)}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{formatCurrency(row.market_cost)}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{formatNumber(tokens)}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{formatNumber(Math.round(avg))}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{formatPercent(hitRate)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
