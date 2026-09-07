import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "@/lib/api/reports";
import { queryKeys } from "@/lib/query/keys";

export function useDashboardQuery() {
  return useQuery({
    queryKey: queryKeys.dashboard.metrics,
    queryFn: () => reportsApi.getDashboard(),
    refetchInterval: 1000 * 30, // Refresh dashboard metrics every 30 seconds
  });
}
