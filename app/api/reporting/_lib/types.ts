export interface GatewayReportRow {
  day?: string;
  hour?: string;
  model?: string;
  provider?: string;
  user?: string;
  tag?: string;
  credential_type?: string;
  total_cost: number;
  market_cost: number;
  input_tokens: number;
  output_tokens: number;
  cached_input_tokens: number;
  cache_creation_input_tokens: number;
  reasoning_tokens: number;
  request_count: number;
}

export interface ReportingTotals {
  totalCost: number;
  totalMarketCost: number;
  totalRequests: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCachedInputTokens: number;
  totalCacheCreationTokens: number;
  totalReasoningTokens: number;
  uniqueModels: number;
  costSavings: number;
  cacheHitRate: number;
}

export interface ReportingResponse {
  byModel: GatewayReportRow[];
  byProvider: GatewayReportRow[];
  byTag: GatewayReportRow[];
  byUser: GatewayReportRow[];
  byCredentialType: GatewayReportRow[];
  daily: GatewayReportRow[];
  hourly: GatewayReportRow[];
  totals: ReportingTotals;
}
