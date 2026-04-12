<script setup lang="ts">
import { ChevronRightIcon } from "@heroicons/vue/24/outline";
import Input from "~/components/form/Input.vue";
import TotpModal from "~/components/profile/TotpModal.vue";
import Card from "~/components/form/Card.vue";
import ButtonInvisible from "~/components/form/ButtonInvisible.vue";
import PasswordModal from "~/components/profile/PasswordModal.vue";
import EmailModal from "~/components/profile/EmailModal.vue";

definePageMeta({
	middleware: "auth",
	layout: "dashboard",
});

const user = useUsers();
const { t } = useI18n();

const errorState = reactive({
	username: false,
});
const credentials = reactive({
	username: user.userData.preferredUsername,
});
const modals = reactive({
	email: false,
	password: false,
	totp: false,
});

const success = () => {
	toast({
		title: t("profile.toast.title"),
		description: t("profile.toast.profile"),
	});
};

const save = () => {
	errorState.username = false;

	if (
		credentials.username.length !== 0 &&
		credentials.username !== user.userData.preferredUsername
	) {
		user
			.updateMe({ username: credentials.username })
			.then((_) => {
				user.userData.preferredUsername = credentials.username;
				success();
			})
			.catch((_) => {
				errorState.username = true;
			});
	}
};
</script>

<template>
	<EmailModal @close="modals.email = false" :visible="modals.email" />
	<PasswordModal @close="modals.password = false" :visible="modals.password" />
	<TotpModal @close="modals.totp = false" :visible="modals.totp" />

	<div class="flex flex-col justify-center items-center mt-16 gap-4 mx-2">
		<ButtonInvisible
			:disabled="credentials.username === user.userData.preferredUsername"
			@click="save"
			class="w-full lg:w-2/5"
			>{{ $t("profile.save") }}</ButtonInvisible
		>

		<Card :title="$t('profile.my_profile')" class="w-full lg:w-2/5">
			<div>
				<label class="text-sm">
					{{ $t("authentification.id") }}
				</label>
				<Input
					v-model="credentials.username"
					autofocus
					type="text"
					min="2"
					max="50"
					:placeholder="$t('authentification.id')"
					:value="user.userData.preferredUsername"
					:error="errorState.username"
					class="w-full"
				/>
			</div>
		</Card>

		<Card :title="$t('profile.contact_info')" class="w-full lg:w-2/5">
			<ButtonInvisible
				@click="modals.email = true"
				class="w-full px-4 flex justify-between"
			>
				<p>{{ $t("profile.email.title") }}</p>
				<ChevronRightIcon class="mt-0.5 size-4" />
			</ButtonInvisible>
		</Card>

		<Card :title="$t('profile.security')" class="w-full lg:w-2/5">
			<ButtonInvisible
				@click="modals.password = true"
				class="w-full px-4 flex justify-between"
			>
				<p>{{ $t("profile.password.title") }}</p>
				<ChevronRightIcon class="mt-0.5 size-4" />
			</ButtonInvisible>

			<ButtonInvisible
				@click="modals.totp = true"
				class="mt-4 w-full px-4 flex justify-between"
			>
				<p>{{ $t("profile.totp.button") }}</p>
				<ChevronRightIcon class="mt-0.5 size-4" />
			</ButtonInvisible>
		</Card>
	</div>
</template>
