import { isProduction } from "std-env";
import type { ServerError, User } from "~/types";
import { ServerErrorClass } from "~/types";

interface Response {
	user: User;
	token: string;
}

const TOKEN_DURATION = 60 * 60 * 24 * 30 * 2; // 2 months.

export const useUsers = defineStore("users", {
	state: () => {
		let { protocol, host } = normalizeUrl(
			useRuntimeConfig().public.defaultServer,
		);

		let token;
		if (useCookie("token").value) {
			const values = useCookie("token").value?.split(".");
			if (values && values[0] && values[1]) {
				host = atob(values[0]);
				token = values[1];
			} else if (values && values[0]) {
				token = values[0];
			}
		}

		return {
			userData: {} as User,
			host,
			protocol,
			_token: token,
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

		async get(user: string = "@me"): Promise<User> {
			const route = `${this.protocol}//${this.host}/users/${user}`;

			try {
				const response = await fetch(route, {
					headers: {
						Accept: "application/json",
						Authorization: this._token ?? "",
					},
				});

				const data = await response.json();

				if (!response.ok) throw new ServerErrorClass(data as ServerError);

				return data as User;
			} catch (error) {
				throw error;
			}
		},

		async signIn(
			email: string,
			password: string,
			totpCode?: string,
		): Promise<void> {
			const route = `${this.protocol}//${this.host}/login`;
			const payload = { email, password, totpCode };
			await this._req(route, payload);
		},

		async signUp(
			id: string,
			email: string,
			password: string,
			invite?: string,
		): Promise<void> {
			const route = `${this.protocol}//${this.host}/create`;
			const payload = { id, email, password, invite };
			await this._req(route, payload);
		},

		async checkInviteCode(invite: string): Promise<boolean | undefined> {
			const route = `${this.protocol}//${this.host}/create`;
			const payload = { invite };
			const res: ServerError = await this._req(route, payload);
			return res.errors?.some((e) => e.field === "invite");
		},

		logout(): void {
			this.userData = {} as User;
			this._token = undefined;
			useCookie("token").value = undefined;
		},

		async removeKey(id: number): Promise<void> {
			const route = `${this.protocol}//${this.host}/users/@me`;
			const payload = { publicKeys: id };
			await this._req(route, payload, {
				method: "patch",
				authorization: this._token,
			});
		},

		async updateMe(opt: {
			pem?: string;
			username?: string;
			email?: string;
			password?: string;
			totpSecret?: string;
			totpCode?: string;
		}): Promise<Array<string>> {
			const route = `${this.protocol}//${this.host}/users/@me`;
			const payload = {
				publicKeys: opt.pem,
				username: opt.username,
				email: opt.email,
				password: opt.password,
				totpSecret: opt.totpSecret,
				totpCode: opt.totpCode,
			};
			return await this._req(route, payload, {
				method: "patch",
				authorization: this._token,
			});
		},

		async delete(password: string) {
			const route = `${this.protocol}//${this.host}/users/@me`;
			return await this._req(
				route,
				{ password },
				{
					method: "delete",
					authorization: this._token,
				},
			);
		},

		async _req(
			url: string,
			body: object,
			opt: { method?: string; authorization?: string } = {
				method: "post",
				authorization: undefined,
			},
		): Promise<any> {
			try {
				const response = await fetch(url, {
					method: opt.method,
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: opt.authorization || "",
					},
					body: JSON.stringify(body),
				});

				const data = await response.json();

				if (!response.ok) throw new ServerErrorClass(data as ServerError);

				if ((data as Response).token) {
					const { token } = data as Response;
					await this._setToken(token);
				} else {
					return data;
				}
			} catch (err) {
				throw err;
			}
		},

		async _setToken(token: string): Promise<void> {
			this._token = token;

			token = `${btoa(this.host)}.${token}`;
			useCookie("token", {
				maxAge: TOKEN_DURATION,
				sameSite: "strict",
				secure: isProduction,
			}).value = token;

			this.userData = await this.get();
		},
	},
});
