import type { AppInfo } from "~/types";
import normalizeUrl from "./normalizeUrl";
import { mande } from "mande";

export default async function (domain: string): Promise<AppInfo> {
  let { protocol, host } = normalizeUrl(domain);
  let url = `${protocol}//${host}`;

  try {
    const json: AppInfo = await mande(`${url}/status.json`).get();
    return json;
  } catch (error) {
    throw error;
  }
}
