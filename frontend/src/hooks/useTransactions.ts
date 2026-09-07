import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsApi } from "@/lib/api/transactions";
import { queryKeys } from "@/lib/query/keys";
import { CheckoutPayload } from "@/types/sales";

export function useTransactionsQuery(startDate?: string, endDate?: string, trxNum?: string) {
  return useQuery({
    queryKey: queryKeys.transactions.list(startDate, endDate, trxNum),
    queryFn: () => transactionsApi.getAll(startDate, endDate, trxNum),
  });
}

export function useTransactionQuery(id: number) {
  return useQuery({
    queryKey: queryKeys.transactions.detail(id),
    queryFn: () => transactionsApi.getById(id),
    enabled: id > 0,
  });
}

export function useReceiptQuery(id: number | null) {
  return useQuery({
    queryKey: queryKeys.transactions.receipt(id || 0),
    queryFn: () => transactionsApi.getReceipt(id!),
    enabled: !!id && id > 0,
  });
}

export function useCreateTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CheckoutPayload) => transactionsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
    },
  });
}
