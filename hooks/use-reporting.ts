import useSWR from "swr";
import { ReportingResponse } from "@/app/api/reporting/_lib/types";

export interface ReportingFilters {
  startDate: string;
  endDate: string;
  model?: string;
  provider?: string;
  tags?: string;
  userId?: string;
  credentialType?: string;
}

const fetcher = (url: string): Promise<ReportingResponse> =>
  fetch(url).then((r) => r.json());

export function useReporting(filters: ReportingFilters) {
  const params = new URLSearchParams({
    start_date: filters.startDate,
    end_date: filters.endDate,
  });
  if (filters.model) params.set("model", filters.model);
  if (filters.provider) params.set("provider", filters.provider);
  if (filters.tags) params.set("tags", filters.tags);
  if (filters.userId) params.set("user_id", filters.userId);
  if (filters.credentialType) params.set("credential_type", filters.credentialType);

  return useSWR<ReportingResponse>(`/api/reporting?${params.toString()}`, fetcher);
}
