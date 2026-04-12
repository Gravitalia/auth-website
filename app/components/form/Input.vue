<script setup lang="ts">
import { ref, watch, computed } from "vue";

const emit = defineEmits<{
	(e: "entry", value: string): void;
}>();

const props = defineProps({
	type: {
		type: String,
		default: "text",
	},
	placeholder: String,
	value: String,
	error: Boolean,
	success: Boolean,
});

const val = ref(props.value || "");

watch(val, () => {
	emit("entry", val.value);
});

const computedClasses = computed(() => {
	if (props.error) {
		return "border-red-400 dark:border-red-600 focus:ring-red-500/50 dark:focus:ring-red-600/50";
	}
	if (props.success) {
		return "border-green-400 dark:border-green-700 focus:ring-green-500/50 dark:focus:ring-green-600/50";
	}
	return "border-zinc-300 dark:border-zinc-700 focus:ring-blue-500/50 dark:focus:ring-blue-500/50";
});
</script>

<template>
	<input
		v-model="val"
		:type="type"
		:placeholder="placeholder"
		:class="[
			'w-full px-3 py-2 text-sm rounded-lg',
			'bg-white dark:bg-zinc-950 border',
			'focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200',
			'placeholder:text-zinc-400 dark:placeholder:text-zinc-600',
			'text-zinc-900 dark:text-white',
			'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-100 dark:disabled:bg-zinc-900',
			computedClasses,
		]"
		tabindex="0"
	/>
</template>
