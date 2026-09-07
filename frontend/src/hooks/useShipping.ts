import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { shippingApi } from "@/lib/api/shipping";
import { queryKeys } from "@/lib/query/keys";

export function useShippingQuery() {
  return useQuery({
    queryKey: queryKeys.shipping.all,
    queryFn: () => shippingApi.getAll(),
  });
}

export function useUpdateShippingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, notes }: { id: number; status: string; notes?: string }) =>
      shippingApi.updateStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipping.all });
    },
  });
}
