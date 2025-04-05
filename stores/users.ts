import { isProduction } from "std-env";
import type { ServerError, User } from "~/types";
import { ServerErrorClass } from "~/types";

interface Response {
  user: User;
  token: string;
}

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

    async signIn(
      email: string,
      password: string,
      totpCode?: string,
    ): Promise<void> {
      const route = `${this.protocol}//${this.host}/login`;

      try {
        const response = await fetch(route, {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, totpCode }),
        });

        let json = await response.json();

        if (!response.ok) {
          json = json as ServerError;
          throw new ServerErrorClass(json);
        }

        json = json as Response;
        useCookie("token", {
          maxAge: 60 * 60 * 24 * 30 * 2, // 2 months.
          sameSite: "strict",
          secure: isProduction,
        }).value = json.token;
      } catch (error) {
        throw error;
      }
    },
  },
});
