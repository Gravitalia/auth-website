export default defineNuxtRouteMiddleware(async (to) => {
  const user = useUsers();

  if (!user._token) {
    // If user is not logged, redirect it to login page.
    return navigateTo("/signin", { redirectCode: 307 });
  } else {
    try {
      user.userData = await user.get();
    } catch (_) {
      return navigateTo("/signin", { redirectCode: 307 });
    }
  }
});
