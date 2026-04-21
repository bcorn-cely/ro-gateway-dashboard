import { NextRequest, NextResponse } from "next/server";
import { format, subDays } from "date-fns";
import { getMockData } from "./_lib/mock-data";
import { GatewayReportRow, ReportingResponse, ReportingTotals } from "./_lib/types";

const GATEWAY_API = "https://ai-gateway.vercel.sh/v1/report";

function computeTotals(byModel: GatewayReportRow[]): ReportingTotals {
  let totalCost = 0;
  let totalMarketCost = 0;
  let totalRequests = 0;
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let totalCachedInputTokens = 0;
  let totalCacheCreationTokens = 0;
  let totalReasoningTokens = 0;
  const models = new Set<string>();

  for (const row of byModel) {
    totalCost += row.total_cost;
    totalMarketCost += row.market_cost;
    totalRequests += row.request_count;
    totalInputTokens += row.input_tokens;
    totalOutputTokens += row.output_tokens;
    totalCachedInputTokens += row.cached_input_tokens;
    totalCacheCreationTokens += row.cache_creation_input_tokens;
    totalReasoningTokens += row.reasoning_tokens;
    if (row.model) models.add(row.model);
  }

  return {
    totalCost: Math.round(totalCost * 100) / 100,
    totalMarketCost: Math.round(totalMarketCost * 100) / 100,
    totalRequests,
    totalInputTokens,
    totalOutputTokens,
    totalCachedInputTokens,
    totalCacheCreationTokens,
    totalReasoningTokens,
    uniqueModels: models.size,
    costSavings: Math.round((totalMarketCost - totalCost) * 100) / 100,
    cacheHitRate: totalInputTokens > 0 ? totalCachedInputTokens / totalInputTokens : 0,
  };
}

async function fetchLiveData(
  apiKey: string,
  startDate: string,
  endDate: string,
  filters: Record<string, string>,
): Promise<Partial<Record<string, GatewayReportRow[]>>> {
  const baseParams = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
  });
  for (const [k, v] of Object.entries(filters)) {
    if (v) baseParams.set(k, v);
  }

  const today = format(new Date(), "yyyy-MM-dd");

  const queries: { key: string; params: URLSearchParams }[] = [
    { key: "byModel", params: new URLSearchParams([...baseParams, ["group_by", "model"]]) },
    { key: "byProvider", params: new URLSearchParams([...baseParams, ["group_by", "provider"]]) },
    { key: "byTag", params: new URLSearchParams([...baseParams, ["group_by", "tag"]]) },
    { key: "byUser", params: new URLSearchParams([...baseParams, ["group_by", "user"]]) },
    { key: "byCredentialType", params: new URLSearchParams([...baseParams, ["group_by", "credential_type"]]) },
    { key: "daily", params: new URLSearchParams([...baseParams, ["date_part", "day"]]) },
    {
      key: "hourly",
      params: new URLSearchParams([
        ["start_date", today],
        ["end_date", today],
        ["date_part", "hour"],
      ]),
    },
  ];

  const results: Partial<Record<string, GatewayReportRow[]>> = {};

  await Promise.all(
    queries.map(async ({ key, params }) => {
      try {
        const res = await fetch(`${GATEWAY_API}?${params.toString()}`, {
          headers: { Authorization: `Bearer ${apiKey}` },
          next: { revalidate: 60 },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.results && Array.isArray(data.results)) {
          results[key] = data.results;
        }
      } catch {
        // swallow — mock data will fill the gap
      }
    }),
  );

  return results;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const startDate = params.get("start_date") || format(subDays(new Date(), 7), "yyyy-MM-dd");
  const endDate = params.get("end_date") || format(new Date(), "yyyy-MM-dd");

  const filters: Record<string, string> = {};
  for (const key of ["model", "provider", "tags", "user_id", "credential_type"]) {
    const val = params.get(key);
    if (val) filters[key] = val;
  }

  const mock = getMockData(startDate, endDate);
  const apiKey = process.env.AI_GATEWAY_API_KEY;

  let byModel = mock.byModel;
  let byProvider = mock.byProvider;
  let byTag = mock.byTag;
  let byUser = mock.byUser;
  let byCredentialType = mock.byCredentialType;
  let daily = mock.daily;
  let hourly = mock.hourly;

  if (apiKey) {
    const live = await fetchLiveData(apiKey, startDate, endDate, filters);
    if (live.byModel) byModel = [...mock.byModel, ...live.byModel];
    if (live.byProvider) byProvider = [...mock.byProvider, ...live.byProvider];
    if (live.byTag) byTag = [...mock.byTag, ...live.byTag];
    if (live.byUser) byUser = [...mock.byUser, ...live.byUser];
    if (live.byCredentialType) byCredentialType = [...mock.byCredentialType, ...live.byCredentialType];
    if (live.daily) daily = [...mock.daily, ...live.daily];
    if (live.hourly) hourly = [...mock.hourly, ...live.hourly];
  }

  const totals = computeTotals(byModel);

  const response: ReportingResponse = {
    byModel,
    byProvider,
    byTag,
    byUser,
    byCredentialType,
    daily,
    hourly,
    totals,
  };

  return NextResponse.json(response);
}
