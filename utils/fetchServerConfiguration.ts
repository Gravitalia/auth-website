import type { AppInfo } from "~/types";

function urlNormalizer(url: string) {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    // Enforce HTTPS, if no protocol is set.
    url = "https://" + url;
  }

  // Parse URL.
  const parsedUrl = new URL(url);

  if (parsedUrl.protocol === "http:" && parsedUrl.hostname !== "localhost") {
    // Force HTTPS if not in local.
    // If HTTPS is not supported, it'll throw an error.
    url = `https://${parsedUrl.host}`;
  } else {
    url = `${parsedUrl.protocol}//${parsedUrl.host}`;
  }

  return url;
}

export default async function (domain: string): Promise<AppInfo> {
  let url = urlNormalizer(domain);

  try {
    const response = await fetch(`${url}/status.json`, { method: "GET" });

    if (!response.ok) {
      throw new Error("Server returned an invalid status.");
    }

    const json: AppInfo = await response.json();
    return json;
  } catch (error) {
    throw error;
  }
}
