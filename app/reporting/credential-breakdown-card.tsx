"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GatewayReportRow } from "@/app/api/reporting/_lib/types";
import { formatCurrency, formatNumber } from "@/lib/format";

interface CredentialBreakdownCardProps {
  data: GatewayReportRow[];
}

export function CredentialBreakdownCard({ data }: CredentialBreakdownCardProps) {
  const system = data.find((r) => r.credential_type === "system");
  const byok = data.find((r) => r.credential_type === "byok");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Credential Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-1" />
              <span className="text-sm font-medium">System (Vercel-managed)</span>
            </div>
            {system ? (
              <div className="space-y-2 pl-5">
                <div>
                  <div className="text-xs text-muted-foreground">Requests</div>
                  <div className="font-mono text-lg font-semibold">
                    {formatNumber(system.request_count)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Charged Cost</div>
                  <div className="font-mono text-lg font-semibold">
                    {formatCurrency(system.total_cost)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Tokens</div>
                  <div className="font-mono text-sm">
                    {formatNumber(system.input_tokens + system.output_tokens)}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground pl-5">No data</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-3" />
              <span className="text-sm font-medium">BYOK (Your Keys)</span>
            </div>
            {byok ? (
              <div className="space-y-2 pl-5">
                <div>
                  <div className="text-xs text-muted-foreground">Requests</div>
                  <div className="font-mono text-lg font-semibold">
                    {formatNumber(byok.request_count)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Market Value</div>
                  <div className="font-mono text-lg font-semibold">
                    {formatCurrency(byok.market_cost)}
                  </div>
                  <div className="text-xs text-muted-foreground">$0 charged (BYOK)</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Tokens</div>
                  <div className="font-mono text-sm">
                    {formatNumber(byok.input_tokens + byok.output_tokens)}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground pl-5">No data</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
