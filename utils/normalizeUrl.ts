export default function (url: string): {
	protocol: "https:" | "http:";
	host: string;
} {
	if (!url.startsWith("http://") && !url.startsWith("https://")) {
		// Add a default protocol.
		// It will be updated later.
		url = "http://" + url;
	}

	// Parse URL.
	const parsedUrl = new URL(url);

	if (parsedUrl.protocol === "http:" && parsedUrl.hostname !== "localhost") {
		// Force HTTPS if not in local.
		// If HTTPS is not supported, it'll throw an error.
		return { protocol: "https:", host: parsedUrl.host };
	} else {
		return {
			protocol: parsedUrl.protocol as "https:" | "http:",
			host: parsedUrl.host,
		};
	}
}
