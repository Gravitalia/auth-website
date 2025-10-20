<script setup lang="ts">
const route = useRoute();

if (import.meta.server) {
	const url = useRequestURL();

	useHead({
		meta: [{ property: "og:url", content: `${url.origin}${route.path}` }],
	});
}
</script>

<template>
	<NuxtLayout>
		<NuxtPage />
		<ToastContainer />
	</NuxtLayout>
</template>
