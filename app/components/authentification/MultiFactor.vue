<script setup lang="ts">
const emit = defineEmits<{
	(e: "code", code: string): void;
}>();

const mfaCode = ref(Array.from({ length: 6 }, (_, _i) => ""));
const mfaInputs = ref([]);

const mfa_keypress = async (event: KeyboardEvent, index: number) => {
	const key = event.key;

	if (key === "Backspace") {
		mfaCode.value[index] = "";
		if (index > 0) {
			mfaInputs.value[index - 1]?.focus();
		}
		event.preventDefault();
	} else if (!isNaN(parseInt(key)) && key >= "0" && key <= "9") {
		mfaCode.value[index] = key;
		if (index < 5) {
			setTimeout(() => {
				mfaInputs.value[index + 1]?.focus();
			}, 50);
		} else {
			const code = mfaCode.value.join("");
			if (code.length === 6) {
				emit("code", code);
			}
		}
	} else {
		event.preventDefault();
	}
};
</script>

<template>
	<div class="flex">
		<input
			v-for="(_, index) in mfaCode"
			:key="index"
			v-model="mfaCode[index]"
			:autofocus="index === 0"
			class="h-12 w-10 border mx-1 rounded flex items-center text-center text-3xl dark:border-zinc-800 dark:bg-zinc-950"
			maxlength="1"
			inputmode="decimal"
			@keydown="(event: Event) => mfa_keypress(event, index)"
			ref="mfaInputs"
		/>
	</div>
</template>
