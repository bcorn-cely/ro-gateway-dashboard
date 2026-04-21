"use client";

import { format, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReportingFilters } from "@/hooks/use-reporting";
import { ReportingResponse } from "@/app/api/reporting/_lib/types";

const PRESETS = [
  { label: "7d", days: 7 },
  { label: "14d", days: 14 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
] as const;

interface ControlsBarProps {
  filters: ReportingFilters;
  onFiltersChange: (filters: ReportingFilters) => void;
  data?: ReportingResponse;
}

function getActiveDays(startDate: string, endDate: string): number | null {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  for (const p of PRESETS) {
    if (diff === p.days) return p.days;
  }
  return null;
}

export function ControlsBar({ filters, onFiltersChange, data }: ControlsBarProps) {
  const activeDays = getActiveDays(filters.startDate, filters.endDate);

  const setPreset = (days: number) => {
    onFiltersChange({
      ...filters,
      startDate: format(subDays(new Date(), days), "yyyy-MM-dd"),
      endDate: format(new Date(), "yyyy-MM-dd"),
    });
  };

  const setFilter = (key: keyof ReportingFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === "all" ? undefined : value,
    });
  };

  const models = data?.byModel?.map((r) => r.model).filter(Boolean) as string[] | undefined;
  const providers = data?.byProvider?.map((r) => r.provider).filter(Boolean) as string[] | undefined;
  const tags = data?.byTag?.map((r) => r.tag).filter(Boolean) as string[] | undefined;
  const users = data?.byUser?.map((r) => r.user).filter(Boolean) as string[] | undefined;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1 rounded-lg border border-border p-1">
        {PRESETS.map((p) => (
          <Button
            key={p.days}
            variant={activeDays === p.days ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => setPreset(p.days)}
          >
            {p.label}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) =>
            onFiltersChange({ ...filters, startDate: e.target.value })
          }
          className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground"
        />
        <span>to</span>
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) =>
            onFiltersChange({ ...filters, endDate: e.target.value })
          }
          className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground"
        />
      </div>

      <div className="h-6 w-px bg-border" />

      {models && models.length > 0 && (
        <Select
          value={filters.model || "all"}
          onValueChange={(v) => setFilter("model", v)}
        >
          <SelectTrigger className="h-8 w-[160px] text-xs">
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Models</SelectItem>
            {models.map((m) => (
              <SelectItem key={m} value={m}>
                {m.split("/").pop()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {providers && providers.length > 0 && (
        <Select
          value={filters.provider || "all"}
          onValueChange={(v) => setFilter("provider", v)}
        >
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue placeholder="Provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Providers</SelectItem>
            {providers.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {tags && tags.length > 0 && (
        <Select
          value={filters.tags || "all"}
          onValueChange={(v) => setFilter("tags", v)}
        >
          <SelectTrigger className="h-8 w-[170px] text-xs">
            <SelectValue placeholder="Tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {tags.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {users && users.length > 0 && (
        <Select
          value={filters.userId || "all"}
          onValueChange={(v) => setFilter("userId", v)}
        >
          <SelectTrigger className="h-8 w-[150px] text-xs">
            <SelectValue placeholder="User" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {users.map((u) => (
              <SelectItem key={u} value={u}>
                {u}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select
        value={filters.credentialType || "all"}
        onValueChange={(v) => setFilter("credentialType", v)}
      >
        <SelectTrigger className="h-8 w-[140px] text-xs">
          <SelectValue placeholder="Credential" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Credentials</SelectItem>
          <SelectItem value="system">System</SelectItem>
          <SelectItem value="byok">BYOK</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
