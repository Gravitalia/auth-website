import { mande } from "mande";

export const useUsers = defineStore("users", {
  state: () => {
    let { protocol, host } = normalizeUrl(
      useRuntimeConfig().public.defaultServer,
    );

    return {
      userData: {},
      host,
      protocol,
    };
  },

  actions: {
    updateApi(
      opt: { host?: string; protocol?: "http:" | "https:" } = {
        host: undefined,
        protocol: undefined,
      },
    ) {
      if (opt.host) this.host = opt.host;
      if (opt.protocol) this.protocol = opt.protocol;
    },

    async signIn(email: string, password: string, code?: string) {
      try {
        const api = mande(`${this.protocol}//${this.host}/users/login`);
        this.userData = await api.post({ email, password, code });
      } catch (error) {
        return error;
      }
    },
  },
});
