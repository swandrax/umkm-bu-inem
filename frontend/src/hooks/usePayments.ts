import { useQuery } from "@tanstack/react-query";
import { paymentsApi } from "@/lib/api/payments";
import { queryKeys } from "@/lib/query/keys";

export function usePaymentsQuery() {
  return useQuery({
    queryKey: queryKeys.payments.all,
    queryFn: () => paymentsApi.getAll(),
  });
}

export function useSalePaymentsQuery(saleId: number) {
  return useQuery({
    queryKey: queryKeys.payments.bySale(saleId),
    queryFn: () => paymentsApi.getBySaleId(saleId),
    enabled: saleId > 0,
  });
}
