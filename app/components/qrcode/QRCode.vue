<script setup lang="ts">
import QRCode from "qrcode";

const { dataUri } = defineProps({
	dataUri: {
		type: String,
		default: "",
	},
});
const src = ref();

const generateQRCode = async (text: string) => {
	try {
		src.value = await QRCode.toDataURL(text);
	} catch (_) {}
};

watch(
	() => dataUri,
	(value) => {
		generateQRCode(value);
	},
	{ immediate: true },
);
</script>

<template>
	<NuxtImg :src class="size-40" />
</template>
