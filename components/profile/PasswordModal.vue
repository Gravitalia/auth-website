<script setup lang="ts">
import type { ServerErrorClass } from "~/types";
import Input from "../form/Input.vue";
import { toast } from "~/composables/useToast";

const errorState = reactive({
	newPassword: false,
	oldPassword: false,
});
const newPassword = ref("");
const oldPassword = ref("");

defineProps({
	visible: Boolean,
});

const { t } = useI18n();
const user = useUsers();

const emit = defineEmits(["close"]);
const close = () => emit("close");
const finish = () => {
	errorState.newPassword = false;
	errorState.oldPassword = false;

	if (newPassword.value === "") {
		errorState.newPassword = true;
		return;
	}

	if (oldPassword.value === "") {
		errorState.oldPassword = true;
		return;
	}

	user
		.updateMe({ password: oldPassword.value })
		.then((_) => {
			toast({
				title: t("profile.toast.title"),
				description: t("profile.toast.password"),
			});
			emit("close");
		})
		.catch((err: ServerErrorClass) => {
			if (err.json.errors?.find((e) => e.field === "password")) {
				errorState.newPassword = true;
			} else {
				errorState.oldPassword = true;
			}
		});
};
</script>

<template>
	<Modal
		@close="close"
		@finish="finish"
		:title="$t('profile.password.title')"
		:visible
	>
		<Input
			autofocus
			required
			v-model="newPassword"
			type="password"
			:placeholder="$t('profile.password.new')"
			:error="errorState.newPassword"
			class="w-full"
		/>

		<Input
			autofocus
			required
			v-model="oldPassword"
			type="password"
			:placeholder="$t('profile.password.old')"
			:error="errorState.oldPassword"
			class="w-full"
		/>
	</Modal>
</template>
