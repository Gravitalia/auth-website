import type { AppInfo } from "~/types";

export async function useAppInfo(url: string) {
  const data: Ref<AppInfo | null> = ref(null);

  const updateInfo = (configuration: AppInfo) => {
    data.value = configuration;
  };

  // Load AppInfo when composable is called.
  data.value = await fetchServerConfiguration(url).catch();

  return {
    data,
    updateInfo,
  };
}
