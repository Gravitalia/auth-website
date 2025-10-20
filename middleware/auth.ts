export default defineNuxtRouteMiddleware(async (to) => {
	const redirectPath = `/signin?redirect=${to.fullPath}`;
	const user = useUsers();

	if (!user._token) {
		// If user is not logged, redirect it to login page.
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
