export default defineNuxtRouteMiddleware(async (to) => {
	const redirectPath = `/signin?redirect=${to.fullPath}`;
	const user = useUsers();

	await user.startTokenRotation();

	if (!user._token) {
		return navigateTo(redirectPath, { redirectCode: 307 });
	} else {
		try {
			user.userData = await user.get();
			user.startTokenRotation();
		} catch (_) {
			return navigateTo(redirectPath, { redirectCode: 307 });
		}
	}
});
