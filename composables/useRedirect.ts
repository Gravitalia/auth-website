export const useRedirect = (defaultRedirect: string) => {
	const staticDefaultServer = useRuntimeConfig().public.defaultServer;
	const redirect = useRoute().query?.redirect?.toString();

	if (redirect && normalizeUrl(redirect).host === staticDefaultServer) {
		return redirect;
	} else {
		return defaultRedirect;
	}
};
