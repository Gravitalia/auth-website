<script setup lang="ts">
import Button from "../form/Button.vue";

interface Props {
	disabledButton?: boolean;
}

interface Emits {
	(e: "finish"): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<template>
	<div
		class="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3"
	>
		<Button :disabled="disabledButton" @click="$emit('finish')">
			{{ $t("modal.done") }}
		</Button>
	</div>
</template>
