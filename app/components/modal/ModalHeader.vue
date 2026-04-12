<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/outline";

interface Props {
	title?: string;
	description?: string;
}

interface Emits {
	(e: "close"): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<template>
	<div class="flex justify-between items-start gap-4">
		<div class="flex-1">
			<h3 class="text-lg font-bold text-zinc-900 dark:text-white">
				{{ title }}
			</h3>
			<p
				v-if="description"
				class="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400"
			>
				{{ description }}
			</p>
		</div>
		<button
			type="button"
			@click="$emit('close')"
			class="p-1.5 rounded-lg transition-colors duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
			:aria-label="$t('close')"
		>
			<XMarkIcon class="size-5" />
		</button>
	</div>
</template>
