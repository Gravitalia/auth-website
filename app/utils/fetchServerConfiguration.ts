import type { AppInfo } from "~/types";
import normalizeUrl from "./normalizeUrl";
import { mande } from "mande";

const STATUS_PATH = "/status.json";

export default async function fetchServerConfiguration(
	domain: string,
): Promise<AppInfo> {
	let { protocol, host } = normalizeUrl(domain);
	let url = `${protocol}//${host}`;

	// If domain is simple path, fetch from current website.
	if (domain === STATUS_PATH) url = "";

	try {
		const json: AppInfo = await mande(url + STATUS_PATH).get();
		return json;
	} catch (error) {
		if (host === normalizeUrl(useRuntimeConfig().public.defaultServer).host) {
			return fetchServerConfiguration(STATUS_PATH);
		} else throw error;
	}
}
