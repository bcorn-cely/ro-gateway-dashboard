"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GatewayReportRow, ReportingTotals } from "@/app/api/reporting/_lib/types";
import { formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

interface CachePerformanceCardProps {
  totals: ReportingTotals;
  daily: GatewayReportRow[];
}

export function CachePerformanceCard({ totals, daily }: CachePerformanceCardProps) {
  const cacheColor = totals.cacheHitRate > 0.5
    ? "text-emerald-400"
    : totals.cacheHitRate > 0.2
      ? "text-amber-400"
      : "text-red-400";

  const efficiency = totals.totalCacheCreationTokens > 0
    ? totals.totalCachedInputTokens / totals.totalCacheCreationTokens
    : 0;

  const dailyRates = daily
    .filter((d) => d.day && d.input_tokens > 0)
    .sort((a, b) => (a.day! > b.day! ? 1 : -1))
    .map((d) => d.cached_input_tokens / d.input_tokens);

  const maxRate = Math.max(...dailyRates, 0.01);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Cache Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Hit Rate</div>
            <div className={cn("text-2xl font-bold mt-1", cacheColor)}>
              {formatPercent(totals.cacheHitRate)}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Creation Tokens</div>
            <div className="text-2xl font-bold mt-1">
              {formatNumber(totals.totalCacheCreationTokens)}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Cached Served</div>
            <div className="text-2xl font-bold mt-1">
              {formatNumber(totals.totalCachedInputTokens)}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Cache efficiency ratio</span>
            <span className="font-mono">{efficiency.toFixed(1)}x return</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${Math.min((efficiency / 10) * 100, 100)}%` }}
            />
          </div>
        </div>

        {dailyRates.length > 1 && (
          <div>
            <div className="text-xs text-muted-foreground mb-2">Daily cache hit rate trend</div>
            <div className="flex items-end gap-px h-12">
              {dailyRates.map((rate, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-chart-1 opacity-70 hover:opacity-100 transition-opacity"
                  style={{ height: `${(rate / maxRate) * 100}%` }}
                  title={`${(rate * 100).toFixed(1)}%`}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
