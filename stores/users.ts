import { isProduction } from "std-env";
import type { ServerError, User, ConnectResponse } from "~/types";
import { ServerErrorClass } from "~/types";

const REFRESH_TOKEN_DURATION = 60 * 60 * 24 * 15; // 15 days.
const SERVER = "server";
const TOKEN = "token";
const REFRESH_TOKEN = "refresh_token";

export const useUsers = defineStore("users", {
	state: () => {
		let { protocol, host } = normalizeUrl(
			useRuntimeConfig().public.defaultServer,
		);

		host = useCookie(SERVER).value ?? host;
		const token = useCookie(TOKEN).value ?? undefined;

		return {
			userData: {} as User,
			host,
			protocol,
			_token: token,
			_refreshIntervalId: undefined as
				| ReturnType<typeof setInterval>
				| undefined,
		};
	},

	actions: {
		/**
		 * Function to initialize token rotation.
		 * After a 15-minute period, JWT expires.
		 * This functions automatically recreates JWT.
		 */
		async startTokenRotation() {
			if (this._refreshIntervalId) return;

			const refreshTokenCookie = useCookie(REFRESH_TOKEN);
			if (refreshTokenCookie.value) {
				if (!useCookie(TOKEN).value) await this._rotateToken();
				this._refreshIntervalId = setInterval(
					async () => {
						await this._rotateToken();
					},
					1000 * 60 * 15,
				);
			}
		},

		/**
		 * Update Autha instance.
		 * @param opt APIs options.
		 */
		updateApi(
			opt: { host?: string; protocol?: "http:" | "https:" } = {
				host: undefined,
				protocol: undefined,
			},
		) {
			if (opt.host) this.host = opt.host;
			if (opt.protocol) this.protocol = opt.protocol;
		},

		/**
		 * Get a user using its ID.
		 * @param {string} id User ID.
		 * @returns {Promise<User>}
		 */
		async get(id: string = "@me"): Promise<User> {
			const route = `${this.protocol}//${this.host}/users/${id}`;

			const response = await fetch(route, {
				headers: {
					Accept: "application/json",
					Authorization: this._token ?? "",
				},
			});

			const data = await response.json();

			if (!response.ok) throw new ServerErrorClass(data as ServerError);

			return data as User;
		},

		/**
		 * Sign in on set Autha instance.
		 * @param {string} email
		 * @param {string} password
		 * @param {string} totpCode
		 */
		async signIn(email: string, password: string, totpCode?: string) {
			const route = `${this.protocol}//${this.host}/login`;
			const payload = { email, password, totpCode };
			return await this._req(route, payload);
		},

		/**
		 * Create an account on Autha instance.
		 * @param {string} id Custom vanity.
		 * @param {string} email
		 * @param {string} password
		 * @param {string} invite
		 */
		async signUp(id: string, email: string, password: string, invite?: string) {
			const route = `${this.protocol}//${this.host}/create`;
			const payload = { id, email, password, invite };
			return await this._req(route, payload);
		},

		async checkInviteCode(invite: string): Promise<boolean | undefined> {
			const route = `${this.protocol}//${this.host}/create`;
			const payload = { invite };
			try {
				const res = (await this._req(route, payload)) as ServerError;
				return res.errors?.some((e) => e.field === "invite");
			} catch (_) {
				return false;
			}
		},

		/**
		 * Clear current user instance.
		 */
		logout(): void {
			// Stop token rotation.
			if (this._refreshIntervalId) {
				clearInterval(this._refreshIntervalId);
				this._refreshIntervalId = undefined;
			}

			// Clear user and cookies.
			this.userData = {} as User;
			this._token = undefined;
			useCookie(REFRESH_TOKEN).value = undefined;
			useCookie(TOKEN).value = undefined;
			useCookie(SERVER).value = undefined;
		},

		/**
		 * Remove a public key from Autha instance.
		 * @param {number} id Key ID.
		 */
		async removeKey(id: number) {
			const route = `${this.protocol}//${this.host}/users/@me`;
			const payload = { publicKeys: id };
			await this._req(route, payload, {
				method: "patch",
				authorization: this._token,
			});
		},

		/**
		 * Update user profile.
		 * @param opt User parameters.
		 */
		async updateMe(opt: {
			pem?: string;
			username?: string;
			email?: string;
			password?: string;
			totpSecret?: string;
			totpCode?: string;
		}) {
			const route = `${this.protocol}//${this.host}/users/@me`;
			const payload = {
				publicKeys: opt.pem,
				username: opt.username,
				email: opt.email,
				password: opt.password,
				totpSecret: opt.totpSecret,
				totpCode: opt.totpCode,
			};
			return this._req(route, payload, {
				method: "patch",
				authorization: this._token,
			});
		},

		/**
		 * Delete user from Autha instance.
		 * @param {string} password
		 * @returns
		 */
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
		): Promise<ConnectResponse | ServerError | Error> {
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

			if ((data as ConnectResponse).token) {
				const { token, refresh_token, expires_in } = data as ConnectResponse;
				await this._setToken(token, refresh_token, expires_in);
				return data;
			} else {
				return data;
			}
		},

		async _setToken(token: string, refresh_token: string, expires_in: number) {
			this._token = token;

			useCookie(SERVER, {
				maxAge: REFRESH_TOKEN_DURATION,
				sameSite: "strict",
				secure: isProduction,
				priority: "high",
			}).value = this.host;

			useCookie(TOKEN, {
				maxAge: expires_in,
				sameSite: "strict",
				secure: isProduction,
			}).value = token;

			useCookie(REFRESH_TOKEN, {
				maxAge: REFRESH_TOKEN_DURATION,
				sameSite: "strict",
				secure: true,
				priority: "high",
			}).value = refresh_token;

			this.userData = await this.get();
			this.startTokenRotation();
		},

		async _renewToken(refresh_token: string) {
			const route = `${this.protocol}//${this.host}/oauth/token`;
			const payload = { grant_type: REFRESH_TOKEN, refresh_token };
			await this._req(route, payload);
		},

		async _rotateToken() {
			const refreshTokenCookie = useCookie(REFRESH_TOKEN);

			if (!refreshTokenCookie.value) {
				this.logout();
				return;
			}

			try {
				await this._renewToken(refreshTokenCookie.value);
			} catch (_) {
				this.logout();
			}
		},
	},
});
