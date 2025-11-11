export const useRedirect = (defaultRedirect: string) => {
	try {
		const staticDefaultServer = useRuntimeConfig().public.defaultServer;
		const redirect = useRoute().query?.redirect?.toString();
		const { host } = normalizeUrl(redirect as string);

		if (redirect && host === staticDefaultServer) {
			return redirect;
		} else {
			return defaultRedirect;
		}
	} catch (_) {
		return defaultRedirect;
	}
};
