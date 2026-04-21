"use client";

import { useState } from "react";
import { format, subDays } from "date-fns";
import { useReporting, ReportingFilters } from "@/hooks/use-reporting";
import { ControlsBar } from "./controls-bar";
import { OverviewCards } from "./overview-cards";
import { CostByModelChart } from "./cost-by-model-chart";
import { SpendByProviderChart } from "./spend-by-provider-chart";
import { TokenUsageChart } from "./token-usage-chart";
import { HourlyPatternChart } from "./hourly-pattern-chart";
import { CachePerformanceCard } from "./cache-performance-card";
import { CredentialBreakdownCard } from "./credential-breakdown-card";
import { TagsTable } from "./tags-table";
import { UserAttributionTable } from "./user-attribution-table";
import { DashboardSkeleton } from "./dashboard-skeleton";

export function ReportingDashboard() {
  const [filters, setFilters] = useState<ReportingFilters>({
    startDate: format(subDays(new Date(), 7), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  const { data, isLoading } = useReporting(filters);

  if (isLoading || !data) {
    return (
      <div className="px-6 py-8 space-y-6">
        <ControlsBar filters={filters} onFiltersChange={setFilters} data={data} />
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="px-6 py-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Governance Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          AI Gateway usage, cost, and performance metrics
        </p>
      </div>

      <ControlsBar filters={filters} onFiltersChange={setFilters} data={data} />

      <section>
        <h3 className="text-xl font-semibold mb-4">Overview</h3>
        <OverviewCards totals={data.totals} />
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4">Cost Analysis</h3>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <CostByModelChart data={data.byModel} />
          </div>
          <div className="lg:col-span-2">
            <SpendByProviderChart data={data.byProvider} />
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4">Usage Over Time</h3>
        <div className="space-y-6">
          <TokenUsageChart data={data.daily} />
          <HourlyPatternChart data={data.hourly} />
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-1">Infrastructure</h3>
        <p className="text-sm text-muted-foreground mb-4">Cache performance and credential usage</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CachePerformanceCard totals={data.totals} daily={data.daily} />
          <CredentialBreakdownCard data={data.byCredentialType} />
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-1">Tags</h3>
        <p className="text-sm text-muted-foreground mb-4">Cost and usage breakdown by tag</p>
        <TagsTable data={data.byTag} />
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-1">User Attribution</h3>
        <p className="text-sm text-muted-foreground mb-4">Per-user cost and token consumption</p>
        <UserAttributionTable data={data.byUser} />
      </section>
    </div>
  );
}
