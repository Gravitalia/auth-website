<script setup lang="ts">
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

const val = ref(props.value);

watch(val, (_o: string, _n: string) => {
	emit("entry", val.value);
});

const computedClasses = computed(() => {
	if (props.error) return "border-red-500 dark:border-red-600";
	if (props.success) return "border-green-600 dark:border-green-800";
	return "border-zinc-200 dark:border-zinc-800";
});
</script>

<template>
	<input
		v-model="val"
		:type="type"
		:placeholder="placeholder"
		:class="[
			'text-sm p-2 rounded dark:bg-zinc-950 outline-none border',
			computedClasses,
		]"
		tabindex="0"
	/>
</template>
