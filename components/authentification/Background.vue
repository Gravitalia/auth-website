<script setup lang="ts">
const props = defineProps({
	href: String,
});
</script>

<template>
    <svg class="absolute -z-10" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
		<image class="w-screen h-screen" :href="props.href" />
	</svg>
</template>