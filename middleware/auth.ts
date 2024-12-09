export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie("token");

  if (!token.value) {
    // If user is not logged, redirect it to login page.
    return navigateTo("/signin", { redirectCode: 307 });
  }
});
