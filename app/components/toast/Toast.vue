<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/outline";

interface Props {
	title?: string;
	description?: string;
	id?: string;
}

const close = () => {
	if (props.id) return; //removeToast(props.id);
};

const props = withDefaults(defineProps<Props>(), {
	id: "",
});
</script>

<template>
	<Transition name="toast-slide">
		<div
			class="flex flex-col max-w-sm w-full gap-2 p-4 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-shadow duration-200"
			role="alert"
			tabindex="0"
		>
			<div
				class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-blue-500 rounded-l-lg"
			></div>

			<div class="flex items-start justify-between gap-3 pl-2">
				<div class="flex-1">
					<div class="text-sm font-semibold text-zinc-900 dark:text-white">
						{{ title }}
					</div>
					<div
						v-if="description"
						class="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5"
					>
						{{ description }}
					</div>
				</div>
				<button
					type="button"
					@click="close"
					class="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
					:aria-label="$t('close')"
				>
					<XMarkIcon class="size-4" />
				</button>
			</div>
		</div>
	</Transition>
</template>

<style scoped>
.toast-slide-enter-active,
.toast-slide-leave-active {
	transition:
		transform 0.3s ease,
		opacity 0.3s ease;
}

.toast-slide-enter-from {
	transform: translateX(400px);
	opacity: 0;
}

.toast-slide-leave-to {
	transform: translateX(400px);
	opacity: 0;
}
</style>
