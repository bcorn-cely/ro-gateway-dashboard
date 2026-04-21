import { GatewayReportRow } from "./types";
import { eachDayOfInterval, format, isWeekend, parseISO } from "date-fns";

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = seededRandom(42);

function vary(base: number, variance: number): number {
  return Math.round(base * (1 + (rand() - 0.5) * 2 * variance));
}

const byModel: GatewayReportRow[] = [
  {
    model: "anthropic/claude-sonnet-4.6",
    total_cost: 2847.32,
    market_cost: 3416.78,
    input_tokens: 18_420_000,
    output_tokens: 4_210_000,
    cached_input_tokens: 9_840_000,
    cache_creation_input_tokens: 2_100_000,
    reasoning_tokens: 0,
    request_count: 24_500,
  },
  {
    model: "anthropic/claude-opus-4.6",
    total_cost: 4_128.91,
    market_cost: 4_954.69,
    input_tokens: 8_320_000,
    output_tokens: 2_640_000,
    cached_input_tokens: 3_200_000,
    cache_creation_input_tokens: 1_400_000,
    reasoning_tokens: 1_920_000,
    request_count: 6_200,
  },
  {
    model: "openai/gpt-4o",
    total_cost: 1_562.44,
    market_cost: 1_874.93,
    input_tokens: 12_100_000,
    output_tokens: 3_100_000,
    cached_input_tokens: 5_600_000,
    cache_creation_input_tokens: 980_000,
    reasoning_tokens: 0,
    request_count: 15_800,
  },
  {
    model: "anthropic/claude-haiku-4.5",
    total_cost: 312.18,
    market_cost: 374.62,
    input_tokens: 32_000_000,
    output_tokens: 8_400_000,
    cached_input_tokens: 18_200_000,
    cache_creation_input_tokens: 3_600_000,
    reasoning_tokens: 0,
    request_count: 42_000,
  },
  {
    model: "openai/o3",
    total_cost: 5_842.15,
    market_cost: 7_010.58,
    input_tokens: 4_200_000,
    output_tokens: 1_800_000,
    cached_input_tokens: 1_400_000,
    cache_creation_input_tokens: 600_000,
    reasoning_tokens: 3_200_000,
    request_count: 2_800,
  },
];

const byProvider: GatewayReportRow[] = [
  {
    provider: "anthropic",
    total_cost: 7_288.41,
    market_cost: 8_746.09,
    input_tokens: 58_740_000,
    output_tokens: 15_250_000,
    cached_input_tokens: 31_240_000,
    cache_creation_input_tokens: 7_100_000,
    reasoning_tokens: 1_920_000,
    request_count: 72_700,
  },
  {
    provider: "openai",
    total_cost: 7_404.59,
    market_cost: 8_885.51,
    input_tokens: 16_300_000,
    output_tokens: 4_900_000,
    cached_input_tokens: 7_000_000,
    cache_creation_input_tokens: 1_580_000,
    reasoning_tokens: 3_200_000,
    request_count: 18_600,
  },
];

const byTag: GatewayReportRow[] = [
  {
    tag: "team:engineering",
    total_cost: 5_420.80,
    market_cost: 6_504.96,
    input_tokens: 28_000_000,
    output_tokens: 7_200_000,
    cached_input_tokens: 14_800_000,
    cache_creation_input_tokens: 3_200_000,
    reasoning_tokens: 2_400_000,
    request_count: 38_200,
  },
  {
    tag: "team:data-science",
    total_cost: 3_890.40,
    market_cost: 4_668.48,
    input_tokens: 22_000_000,
    output_tokens: 5_800_000,
    cached_input_tokens: 11_000_000,
    cache_creation_input_tokens: 2_400_000,
    reasoning_tokens: 1_800_000,
    request_count: 22_100,
  },
  {
    tag: "team:product",
    total_cost: 1_240.20,
    market_cost: 1_488.24,
    input_tokens: 8_400_000,
    output_tokens: 2_100_000,
    cached_input_tokens: 4_200_000,
    cache_creation_input_tokens: 900_000,
    reasoning_tokens: 320_000,
    request_count: 12_400,
  },
  {
    tag: "feature:code-review",
    total_cost: 4_200.60,
    market_cost: 5_040.72,
    input_tokens: 18_000_000,
    output_tokens: 4_800_000,
    cached_input_tokens: 9_600_000,
    cache_creation_input_tokens: 2_100_000,
    reasoning_tokens: 1_600_000,
    request_count: 28_000,
  },
  {
    tag: "feature:incident-response",
    total_cost: 2_810.50,
    market_cost: 3_372.60,
    input_tokens: 14_200_000,
    output_tokens: 3_600_000,
    cached_input_tokens: 7_400_000,
    cache_creation_input_tokens: 1_600_000,
    reasoning_tokens: 1_200_000,
    request_count: 15_800,
  },
  {
    tag: "feature:sandbox",
    total_cost: 1_920.30,
    market_cost: 2_304.36,
    input_tokens: 10_600_000,
    output_tokens: 2_800_000,
    cached_input_tokens: 5_200_000,
    cache_creation_input_tokens: 1_100_000,
    reasoning_tokens: 600_000,
    request_count: 10_200,
  },
  {
    tag: "env:production",
    total_cost: 8_400.90,
    market_cost: 10_081.08,
    input_tokens: 42_000_000,
    output_tokens: 11_200_000,
    cached_input_tokens: 22_400_000,
    cache_creation_input_tokens: 4_800_000,
    reasoning_tokens: 3_600_000,
    request_count: 58_000,
  },
  {
    tag: "env:staging",
    total_cost: 2_150.50,
    market_cost: 2_580.60,
    input_tokens: 12_000_000,
    output_tokens: 3_000_000,
    cached_input_tokens: 5_800_000,
    cache_creation_input_tokens: 1_300_000,
    reasoning_tokens: 820_000,
    request_count: 16_800,
  },
];

const byUser: GatewayReportRow[] = [
  {
    user: "clem@ro.co",
    total_cost: 4_820.30,
    market_cost: 5_784.36,
    input_tokens: 24_000_000,
    output_tokens: 6_200_000,
    cached_input_tokens: 12_800_000,
    cache_creation_input_tokens: 2_800_000,
    reasoning_tokens: 2_100_000,
    request_count: 28_400,
  },
  {
    user: "justin@ro.co",
    total_cost: 3_640.20,
    market_cost: 4_368.24,
    input_tokens: 18_600_000,
    output_tokens: 4_800_000,
    cached_input_tokens: 9_800_000,
    cache_creation_input_tokens: 2_100_000,
    reasoning_tokens: 1_400_000,
    request_count: 22_200,
  },
  {
    user: "nathan@ro.co",
    total_cost: 2_890.60,
    market_cost: 3_468.72,
    input_tokens: 14_200_000,
    output_tokens: 3_600_000,
    cached_input_tokens: 7_400_000,
    cache_creation_input_tokens: 1_600_000,
    reasoning_tokens: 980_000,
    request_count: 18_100,
  },
  {
    user: "sarah@ro.co",
    total_cost: 1_980.40,
    market_cost: 2_376.48,
    input_tokens: 10_400_000,
    output_tokens: 2_600_000,
    cached_input_tokens: 5_200_000,
    cache_creation_input_tokens: 1_100_000,
    reasoning_tokens: 420_000,
    request_count: 14_200,
  },
  {
    user: "alex@ro.co",
    total_cost: 1_361.50,
    market_cost: 1_633.80,
    input_tokens: 7_840_000,
    output_tokens: 2_950_000,
    cached_input_tokens: 3_040_000,
    cache_creation_input_tokens: 1_080_000,
    reasoning_tokens: 220_000,
    request_count: 8_400,
  },
];

const byCredentialType: GatewayReportRow[] = [
  {
    credential_type: "system",
    total_cost: 11_240.80,
    market_cost: 13_488.96,
    input_tokens: 52_000_000,
    output_tokens: 14_000_000,
    cached_input_tokens: 28_000_000,
    cache_creation_input_tokens: 6_200_000,
    reasoning_tokens: 3_800_000,
    request_count: 68_200,
  },
  {
    credential_type: "byok",
    total_cost: 0,
    market_cost: 4_142.64,
    input_tokens: 23_040_000,
    output_tokens: 6_150_000,
    cached_input_tokens: 10_240_000,
    cache_creation_input_tokens: 2_480_000,
    reasoning_tokens: 1_320_000,
    request_count: 23_100,
  },
];

function generateDailyData(startDate: string, endDate: string): GatewayReportRow[] {
  const days = eachDayOfInterval({
    start: parseISO(startDate),
    end: parseISO(endDate),
  });

  return days.map((day) => {
    const weekend = isWeekend(day);
    const multiplier = weekend ? 0.4 : 1;
    const baseCost = 520 * multiplier;
    const baseRequests = 3200 * multiplier;
    const baseInputTokens = 2_600_000 * multiplier;
    const baseOutputTokens = 680_000 * multiplier;

    return {
      day: format(day, "yyyy-MM-dd"),
      total_cost: Math.round(vary(baseCost, 0.2) * 100) / 100,
      market_cost: Math.round(vary(baseCost * 1.2, 0.2) * 100) / 100,
      input_tokens: vary(baseInputTokens, 0.15),
      output_tokens: vary(baseOutputTokens, 0.15),
      cached_input_tokens: vary(baseInputTokens * 0.52, 0.18),
      cache_creation_input_tokens: vary(baseInputTokens * 0.1, 0.2),
      reasoning_tokens: vary(180_000 * multiplier, 0.3),
      request_count: vary(baseRequests, 0.15),
    };
  });
}

function generateHourlyData(): GatewayReportRow[] {
  const hourlyProfile = [
    0.05, 0.03, 0.02, 0.02, 0.03, 0.06, 0.12, 0.28,
    0.65, 0.92, 1.0, 0.95, 0.72, 0.88, 0.96, 0.90,
    0.82, 0.68, 0.42, 0.28, 0.18, 0.12, 0.08, 0.06,
  ];

  return hourlyProfile.map((weight, hour) => {
    const baseCost = 22 * weight;
    return {
      hour: String(hour),
      total_cost: Math.round(vary(baseCost, 0.15) * 100) / 100,
      market_cost: Math.round(vary(baseCost * 1.2, 0.15) * 100) / 100,
      input_tokens: vary(110_000 * weight, 0.15),
      output_tokens: vary(28_000 * weight, 0.15),
      cached_input_tokens: vary(58_000 * weight, 0.18),
      cache_creation_input_tokens: vary(11_000 * weight, 0.2),
      reasoning_tokens: vary(8_000 * weight, 0.3),
      request_count: vary(140 * weight, 0.15),
    };
  });
}

export function getMockData(startDate: string, endDate: string) {
  return {
    byModel,
    byProvider,
    byTag,
    byUser,
    byCredentialType,
    daily: generateDailyData(startDate, endDate),
    hourly: generateHourlyData(),
  };
}
