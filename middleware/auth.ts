export default defineNuxtRouteMiddleware(async (_to) => {
	const user = useUsers();

	if (!user._token) {
		// If user is not logged, redirect it to login page.
		return navigateTo("/signin", { redirectCode: 307 });
	} else {
		try {
			user.userData = await user.get();
			user.startTokenRotation();
		} catch (_) {
			return navigateTo("/signin", { redirectCode: 307 });
		}
	}
});
