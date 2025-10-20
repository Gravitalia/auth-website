<script setup lang="ts">
const b64Challenge = ref("");
onMounted(() => {
	const generateChallenge = (length = 32) => {
		const challenge = new Uint8Array(length);
		window.crypto.getRandomValues(challenge);
		return challenge;
	};

	const challenge = generateChallenge();
	b64Challenge.value = btoa(String.fromCharCode(...challenge));
});
</script>

<template>
	<p>Example of base64 encoded challenge: {{ b64Challenge }}</p>
</template>
