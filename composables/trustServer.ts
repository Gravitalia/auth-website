import { useStorage } from "@vueuse/core";

export function useTrustedServer() {
  const servers: MaybeRefOrGetter<string[]> = useStorage("servers", []);

  const addServer = (url: string) => {
    let { protocol, host } = normalizeUrl(url);

    if (!servers.value.find((u) => u === url)) servers.value.push(host);
  };

  const removeServer = (url: string) => {
    let { protocol, host } = normalizeUrl(url);

    const elementIndex = servers.value.indexOf(host);
    servers.value.splice(elementIndex, 1);
  };

  const defaultServer = (suggestedServer?: string) => {
    if (suggestedServer) {
      let { protocol, host } = normalizeUrl(suggestedServer);
      suggestedServer = host;

      if (servers.value.find((u) => u === suggestedServer))
        return suggestedServer;
      else return useRuntimeConfig().public.defaultServer;
    } else return useRuntimeConfig().public.defaultServer;
  };

  return {
    servers,
    addServer,
    removeServer,
    defaultServer,
  };
}
