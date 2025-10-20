<script setup lang="ts">
import Input from "../form/Input.vue";

const user = useUsers();
const password = ref("");

defineProps({
	visible: Boolean,
});

const emit = defineEmits(["close"]);
const close = () => emit("close");
const finish = () => {
	user.delete(password.value);
};
</script>

<template>
	<Modal
		@close="close"
		@finish="finish"
		:title="$t('account.delete.title')"
		:visible
	>
		<p class="text-sm text-zinc-600 dark:text-zinc-300">
			{{ $t("account.delete.description") }}
		</p>
		<Input
			v-model="password"
			type="password"
			required
			class="mt-4 w-full"
			:placeholder="$t('authentification.password')"
		/>
	</Modal>
</template>
