"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportingTotals } from "@/app/api/reporting/_lib/types";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

interface OverviewCardsProps {
  totals: ReportingTotals;
}

export function OverviewCards({ totals }: OverviewCardsProps) {
  const savingsPercent = totals.totalMarketCost > 0
    ? (totals.costSavings / totals.totalMarketCost) * 100
    : 0;

  const cacheColor = totals.cacheHitRate > 0.5
    ? "text-emerald-400"
    : totals.cacheHitRate > 0.2
      ? "text-amber-400"
      : "text-red-400";

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Spend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{formatCurrency(totals.totalCost)}</div>
          <p className="text-sm text-muted-foreground mt-1">charged cost</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Market Cost
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{formatCurrency(totals.totalMarketCost)}</div>
          <p className="text-sm text-emerald-400 mt-1">
            saving {formatCurrency(totals.costSavings)} / {savingsPercent.toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{formatNumber(totals.totalRequests)}</div>
          <p className="text-sm text-muted-foreground mt-1">across all models</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {formatNumber(totals.totalInputTokens + totals.totalOutputTokens)}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {formatNumber(totals.totalInputTokens)} in / {formatNumber(totals.totalOutputTokens)} out
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Cache Hit Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn("text-3xl font-bold", cacheColor)}>
            {formatPercent(totals.cacheHitRate)}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {formatNumber(totals.totalCachedInputTokens)} cached tokens
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Models Active
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totals.uniqueModels}</div>
          <p className="text-sm text-muted-foreground mt-1">unique models</p>
        </CardContent>
      </Card>
    </div>
  );
}
