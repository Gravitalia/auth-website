import { useStorage } from "@vueuse/core";

export function useTrustedServer() {
  const servers: MaybeRefOrGetter<string[]> = useStorage("servers", []);

  const addServer = (url: string) => {
    let { protocol, host } = normalizeUrl(url);
    url = `${protocol}//${host}`;

    if (!servers.value.find((u) => u === url)) servers.value.push(url);
  };

  const removeServer = (url: string) => {
    let { protocol, host } = normalizeUrl(url);

    const elementIndex = servers.value.indexOf(`${protocol}//${host}`);
    servers.value.splice(elementIndex, 1);
  };

  const defaultServer = (suggestedServer?: string) => {
    if (suggestedServer) {
      let { protocol, host } = normalizeUrl(suggestedServer);
      suggestedServer = `${protocol}//${host}`;

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
