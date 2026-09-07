import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "@/lib/api/reports";
import { queryKeys } from "@/lib/query/keys";

export function useDailyReportQuery(date: string) {
  return useQuery({
    queryKey: queryKeys.reports.daily(date),
    queryFn: () => reportsApi.getDaily(date),
  });
}

export function useWeeklyReportQuery(startDate: string) {
  return useQuery({
    queryKey: queryKeys.reports.weekly(startDate),
    queryFn: () => reportsApi.getWeekly(startDate),
  });
}

export function useMonthlyReportQuery(year: number, month: number) {
  return useQuery({
    queryKey: queryKeys.reports.monthly(year, month),
    queryFn: () => reportsApi.getMonthly(year, month),
  });
}
