<script setup lang="ts">
import { ArrowTopRightOnSquareIcon } from "@heroicons/vue/24/outline";
import HostModal from "~/components/authentification/HostModal.vue";
import TrustModal from "~/components/authentification/TrustModal.vue";
import Button from "~/components/form/Button.vue";
import ButtonInvisible from "~/components/form/ButtonInvisible.vue";
import Card from "~/components/form/Card.vue";
import Input from "~/components/form/Input.vue";
import useEnterKey from "~/composables/useEnterKey";
import type { AppInfo } from "~/types";
import { ServerErrorClass } from "~/types";
import { useUsers } from "~/stores/users";

// Load custom server manager.
const staticDefaultServer = useRuntimeConfig().public.defaultServer;
const trustServer = reactive({
	server: "",
	shown: false,
});
const { addServer, defaultServer } = useTrustedServer();
const { data, updateInfo } = await useAppInfo(
	`${staticDefaultServer}/status.json`,
);
const { t } = useI18n();

const checkAndUpdateServer = async () => {
	const server = useRoute().query?.server?.toString();
	console.log(server);
	const defaultHoister = defaultServer(server);

	const newStatus = await useAppInfo(`${defaultHoister}/status.json`);
	if (newStatus.data.value) {
		hostUpdate(defaultHoister, newStatus.data.value);
	}

	if (server && defaultHoister === staticDefaultServer) {
		trustServer.server = server;
		trustServer.shown = true;
	}
};

onMounted(checkAndUpdateServer);

// Login logic.
const user = useUsers();

const isModalVisible = ref(false);
const step = ref(data.value?.invite_only ? 0 : 1);
const errorState = reactive({
	url: false,
	id: false,
	email: false,
	password: false,
	invite_code: false,
});
const formData = reactive({
	id: "",
	email: "",
	password: "",
	invite_code: "",
});

const hostUpdate = (url?: string, info?: AppInfo) => {
	isModalVisible.value = false;
	trustServer.shown = false;

	if (url && info) {
		updateInfo(info);
		user.updateApi(normalizeUrl(info.url));
		addServer(url);
		// Add server update on user history.
		useRouter().push({ query: { server: url } });
	}
};

const error = (field: keyof typeof errorState, message: string) => {
	errorState[field] = true;
	toast({
		title: t("error.form.title"),
		description: t(message),
	});
};

const create = async () => {
	// Handle step 0 (invite).
	if (step.value === 0 && formData.invite_code !== "") {
		if (await user.checkInviteCode(formData.invite_code)) {
			step.value++;
			return;
		} else {
			return error("invite_code", "error.form.invite_code");
		}
	} else if (
		(step.value === 0 || data.value?.invite_only) &&
		formData.invite_code === ""
	)
		return error("invite_code", "error.form.invite_code");

	errorState.id = false;
	errorState.email = false;
	errorState.password = false;
	errorState.invite_code = false;

	// Handle step 1 (data).
	if (formData.id === "" || formData.id.length < 2 || formData.id.length > 15)
		return (step.value = 1), error("id", "error.form.id");
	else if (formData.email === "" || !isValidEmail(formData.email))
		return (step.value = 1), error("email", "error.form.email");
	else if (formData.password === "" || formData.password.length < 8)
		return (step.value = 1), error("password", "error.form.password");

	// Handle step 2 (tos).
	if (
		step.value === 1 &&
		(data.value?.terms_of_service?.length !== 0 ||
			data.value?.privacy_policy?.length !== 0)
	)
		return step.value++;

	user
		.signUp(
			formData.id,
			formData.email,
			formData.password,
			formData.invite_code,
		)
		.then(async () => {
			await navigateTo("/");
		})
		.catch((err: ServerErrorClass) => {
			if (err.json.errors?.find((e) => e.field === "invite")) {
				step.value = 0;
				error("invite_code", "error.form.invite_code");
			} else if (err.json.detail?.includes("Key (id)=")) {
				step.value = 1;
				error("id", "error.form.id");
			} else if (err.json.detail?.includes("Key (email)=")) {
				step.value = 1;
				error("email", "error.form.email");
			} else if (err.json.errors?.find((e) => e.field === "password")) {
				step.value = 1;
				error("password", "error.form.password");
			}
		});
};

useEnterKey(create);
</script>

<template>
	<!-- Hosting provider edit modal dialog. -->
	<HostModal
		@host="hostUpdate"
		:visible="isModalVisible"
		:defaultValue="user.host"
	/>

	<TrustModal
		@host="hostUpdate"
		:visible="trustServer.shown"
		:server="trustServer.server"
	/>

	<form
		@submit.prevent="function () {}"
		class="flex flex-col items-center h-screen gap gap-y-6"
		:style="{
			backgroundImage: 'url(' + data?.background + ')',
			backgroundRepeat: 'no-repeat',
			backgroundSize: 'cover',
		}"
	>
		<!-- Centered card with the form. -->
		<Card class="w-80 lg:w-96" :title="$t('authentification.create')">
			<div class="flex flex-col flex-grow">
				<!-- Section to open modal and update hosting provider. -->
				<p class="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
					{{ $t("authentification.host_provider") }}
				</p>
				<ButtonInvisible @click="isModalVisible = true" class="mt-2 w-full">
					{{
						data?.url === useRuntimeConfig().public.defaultServer
							? $t("default")
							: data?.name || $t("no_name")
					}}
				</ButtonInvisible>
			</div>

			<hr class="my-4 border-zinc-200 dark:border-zinc-800" />

			<div v-if="step === 0">
				<p
					:class="[
						'text-sm mb-4',
						errorState.invite_code
							? 'text-red-500 dark:text-red-600'
							: 'text-zinc-600 dark:text-zinc-300',
					]"
				>
					{{ $t("authentification.invite_only") }}
				</p>

				<Input
					@entry="(val: string) => (formData.invite_code = val)"
					:error="errorState.invite_code"
					autofocus
					required
					type="text"
					:placeholder="$t('authentification.invite_code')"
					class="w-full"
				/>
			</div>

			<!-- ID, email and password combo. -->
			<div v-show="step === 1">
				<div class="flex flex-col flex-grow space-y-2">
					<p
						:class="[
							'text-sm font-semibold',
							errorState.id
								? 'text-red-500 dark:text-red-600'
								: 'text-zinc-600 dark:text-zinc-300',
						]"
					>
						{{ $t("authentification.id") }}
					</p>
					<Input
						@entry="(val: string) => (formData.id = val)"
						:error="errorState.id"
						autofocus
						required
						minlength="2"
						maxlength="15"
						type="text"
						:placeholder="$t('authentification.id')"
						class="w-full"
					/>

					<p
						:class="[
							'text-sm font-semibold',
							errorState.email
								? 'text-red-500 dark:text-red-600'
								: 'text-zinc-600 dark:text-zinc-300',
						]"
					>
						{{ $t("authentification.email") }}
					</p>
					<Input
						@entry="(val: string) => (formData.email = val)"
						:error="errorState.email"
						autofocus
						required
						type="email"
						:placeholder="$t('authentification.email')"
						class="w-full"
					/>

					<p class="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
						{{ $t("authentification.password") }}
					</p>
					<Input
						@entry="(val: string) => (formData.password = val)"
						:error="errorState.password"
						required
						type="password"
						minlength="8"
						:placeholder="$t('authentification.password')"
						class="w-full"
					/>
				</div>
			</div>

			<div v-show="step === 2">
				<NuxtLink
					tabindex="0"
					class="text-sm text-blue-500 dark:text-blue-400 hover:underline flex"
					target="_blank"
					rel="noopener noreferrer"
					v-if="data?.terms_of_service"
					:to="data?.terms_of_service"
					>{{ $t("authentification.tos") }}
					<ArrowTopRightOnSquareIcon class="ml-0.5 size-4" />
				</NuxtLink>
				<NuxtLink
					tabindex="0"
					class="text-sm text-blue-500 dark:text-blue-400 hover:underline flex"
					target="_blank"
					rel="noopener noreferrer"
					v-if="data?.privacy_policy"
					:to="data?.privacy_policy"
					>{{ $t("authentification.privacy") }}
					<ArrowTopRightOnSquareIcon class="ml-0.5 size-4" />
				</NuxtLink>

				<p class="text-sm mt-4">
					{{ $t("authentification.terms") }}
				</p>
			</div>
		</Card>

		<Button
			class="w-80 lg:w-96"
			@click="create"
			:type="
				step === 0 ||
				(step === 1 && (data?.terms_of_service || data?.privacy_policy))
					? 'button'
					: 'submit'
			"
			>{{
				step === 0
					? $t("next")
					: step === 1 && (data?.terms_of_service || data?.privacy_policy)
						? $t("next")
						: $t("authentification.create")
			}}</Button
		>

		<footer
			class="bg-white dark:bg-zinc-950 flex justify-center w-full h-24 border-t border-zinc-200 dark:border-zinc-800 mt-auto"
		>
			<NuxtLink
				tabindex="0"
				to="/signin"
				class="mt-10 text-blue-500 dark:text-blue-400 hover:underline"
			>
				{{ $t("authentification.login_account") }}
			</NuxtLink>
		</footer>
	</form>
</template>
