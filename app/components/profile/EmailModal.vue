<script setup lang="ts">
import type { ServerErrorClass } from "~/types";
import Input from "../form/Input.vue";
import { toast } from "~/composables/useToast";

const errorState = reactive({
	email: false,
	password: false,
});
const credentials = reactive({
	email: "",
	password: "",
});

defineProps({
	visible: Boolean,
});

const { t } = useI18n();
const user = useUsers();

const emit = defineEmits(["close"]);
const close = () => emit("close");
const finish = () => {
	errorState.email = false;
	errorState.password = false;

	if (credentials.email === "") {
		errorState.email = true;
		return;
	}

	if (credentials.password === "") {
		errorState.password = true;
		return;
	}

	user
		.updateMe({ email: credentials.email, password: credentials.password })
		.then((_) => {
			toast({
				title: t("profile.toast.title"),
				description: t("profile.toast.profile"),
			});
			emit("close");
		})
		.catch((err: ServerErrorClass) => {
			if (err.json.errors?.find((e) => e.field === "password")) {
				errorState.password = true;
			} else {
				errorState.email = true;
			}
		});
};
</script>

<template>
	<Modal
		@close="close"
		@finish="finish"
		:title="$t('profile.email.title')"
		:description="$t('profile.email.description')"
		:visible
	>
		<form @submit.prevent="finish()">
			<div>
				<label
					:class="[
						'text-sm',
						errorState.email
							? 'text-red-500 dark:text-red-600'
							: 'text-zinc-600 dark:text-zinc-300',
					]"
				>
					{{ $t("authentification.email") }}
				</label>
				<Input
					autofocus
					required
					v-model="credentials.email"
					type="email"
					:placeholder="$t('authentification.email')"
					:error="errorState.email"
					class="w-full"
				/>
			</div>
			<div class="mt-4">
				<label
					:class="[
						'text-sm',
						errorState.password
							? 'text-red-500 dark:text-red-600'
							: 'text-zinc-600 dark:text-zinc-300',
					]"
				>
					{{ $t("authentification.password") }}
				</label>
				<Input
					v-model="credentials.password"
					autofocus
					required
					type="password"
					:placeholder="$t('authentification.password')"
					:error="errorState.password"
					class="w-full"
				/>
			</div>
		</form>
	</Modal>
</template>
