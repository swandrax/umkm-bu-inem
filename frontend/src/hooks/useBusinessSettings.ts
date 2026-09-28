"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBusinessSettings, updateBusinessSettings } from "@/lib/api/settings";
import { BusinessSettings, DEFAULT_BUSINESS_SETTINGS } from "@/types/settings";

export function useBusinessSettings() {
  const queryClient = useQueryClient();

  const query = useQuery<BusinessSettings>({
    queryKey: ["business-settings"],
    queryFn: getBusinessSettings,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
    placeholderData: DEFAULT_BUSINESS_SETTINGS,
  });

  const mutation = useMutation({
    mutationFn: (newSettings: Partial<BusinessSettings>) =>
      updateBusinessSettings(newSettings),
    onSuccess: (updated) => {
      queryClient.setQueryData(["business-settings"], updated);
      queryClient.invalidateQueries({ queryKey: ["business-settings"] });
    },
  });

  return {
    settings: query.data || DEFAULT_BUSINESS_SETTINGS,
    isLoading: query.isLoading,
    isError: query.isError,
    updateSettings: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}
