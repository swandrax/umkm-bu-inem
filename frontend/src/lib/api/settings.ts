import { apiClient } from "./client";
import { BusinessSettings, DEFAULT_BUSINESS_SETTINGS } from "@/types/settings";

export async function getBusinessSettings(): Promise<BusinessSettings> {
  try {
    return await apiClient.get<BusinessSettings>("/business-settings");
  } catch (err) {
    console.warn("Using fallback business settings:", err);
    return DEFAULT_BUSINESS_SETTINGS;
  }
}

export async function updateBusinessSettings(
  settings: Partial<BusinessSettings>
): Promise<BusinessSettings> {
  return apiClient.put<BusinessSettings>("/business-settings", settings);
}
