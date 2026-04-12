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
import { useRedirect } from "~/composables/useRedirect";
import { toast } from "~/composables/useToast";

interface ErrorState {
	url: boolean;
	id: boolean;
	email: boolean;
	password: boolean;
	invite_code: boolean;
}

interface FormData {
	id: string;
	email: string;
	password: string;
	invite_code: string;
}

interface TrustServer {
	server: string;
	shown: boolean;
}

const staticDefaultServer = useRuntimeConfig().public.defaultServer;
const { t, locale } = useI18n();
const user = useUsers();

const trustServer = reactive<TrustServer>({
	server: "",
	shown: false,
});
const { addServer, defaultServer } = useTrustedServer();
const { data, updateInfo } = await useAppInfo(
	`${staticDefaultServer}/status.json`,
);

const checkAndUpdateServer = async (): Promise<void> => {
	const server = useRoute().query?.server?.toString();
	const defaultHoister = defaultServer(server);

	const newStatus = await useAppInfo(`${defaultHoister}/status.json`);
	if (newStatus.data.value) {
		hostUpdate(defaultHoister, newStatus.data.value);
	}

	if (
		server &&
		defaultHoister === staticDefaultServer &&
		server !== staticDefaultServer
	) {
		trustServer.server = server;
		trustServer.shown = true;
	}
};

onMounted(checkAndUpdateServer);

const isModalVisible = ref<boolean>(false);
const step = ref<number>(data.value?.invite_only ? 0 : 1);
const errorState = reactive<ErrorState>({
	url: false,
	id: false,
	email: false,
	password: false,
	invite_code: false,
});
const formData = reactive<FormData>({
	id: "",
	email: "",
	password: "",
	invite_code: "",
});

const hostUpdate = (url?: string, info?: AppInfo): void => {
	isModalVisible.value = false;
	trustServer.shown = false;

	if (url && info) {
		updateInfo(info);
		user.updateApi(normalizeUrl(info.url));
		addServer(url);
		if (url !== staticDefaultServer) {
			useRouter().push({ query: { server: url } });
		}
	}
};

const handleError = (field: keyof ErrorState, message: string): void => {
	errorState[field] = true;
	toast({
		title: t("error.form.title"),
		description: t(message),
	});
};

const validateInviteCode = async (): Promise<boolean> => {
	if (!formData.invite_code) {
		handleError("invite_code", "error.form.invite_code");
		return false;
	}

	return (await user.checkInviteCode(formData.invite_code)) || false;
};

const validateUserData = (): boolean => {
	errorState.id = false;
	errorState.email = false;
	errorState.password = false;

	if (!formData.id || formData.id.length < 2 || formData.id.length > 15) {
		handleError("id", "error.form.id");
		return false;
	}

	if (!formData.email || !isValidEmail(formData.email)) {
		handleError("email", "error.form.email");
		return false;
	}

	if (!formData.password || formData.password.length < 8) {
		handleError("password", "error.form.password");
		return false;
	}

	return true;
};

const create = async (): Promise<void> => {
	if (step.value === 0) {
		if (!(await validateInviteCode())) {
			return;
		}
		step.value = 1;
		return;
	}

	if (!validateUserData()) {
		step.value = 1;
		return;
	}

	if (
		step.value === 1 &&
		(data.value?.terms_of_service || data.value?.privacy_policy)
	) {
		step.value = 2;
		return;
	}

	try {
		const response = await user.signUp(
			formData.id,
			formData.email,
			formData.password,
			locale.value,
			formData.invite_code,
		);

		if (response) {
			await navigateTo(useRedirect("/"));
		}
	} catch (err) {
		const error = err as ServerErrorClass;
		try {
			if (error.json?.errors?.some((e) => e.field === "invite")) {
				step.value = 0;
				handleError("invite_code", "error.form.invite_code");
			} else if (error.json?.detail?.includes("Key (id)=")) {
				step.value = 1;
				handleError("id", "error.form.id");
			} else if (error.json?.detail?.includes("Key (email)=")) {
				step.value = 1;
				handleError("email", "error.form.email");
			} else if (error.json?.errors?.some((e) => e.field === "password")) {
				step.value = 1;
				handleError("password", "error.form.password");
			}
		} catch (_) {
			toast({
				title: t("error.internal_server_error"),
				description: t("error.internal_server_error"),
			});
		}
	}
};

useEnterKey(create);
</script>

<template>
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

	<AuthentificationBackground v-if="data?.background" :href="data.background" />

	<div class="flex flex-col h-screen">
		<div class="flex-1 flex items-center justify-center px-4">
			<div class="w-full max-w-sm">
				<form @submit.prevent="() => {}" class="space-y-6">
					<Card :title="$t('authentification.create')">
						<div class="mb-6">
							<p
								class="text-sm font-semibold text-zinc-600 dark:text-zinc-300 mb-2"
							>
								{{ $t("authentification.host_provider") }}
							</p>
							<ButtonInvisible @click="isModalVisible = true" class="w-full">
								{{
									data?.url === useRuntimeConfig().public.defaultServer
										? $t("default")
										: data?.name || $t("no_name")
								}}
							</ButtonInvisible>
						</div>

						<hr class="my-4 border-zinc-200 dark:border-zinc-800" />

						<div v-if="step === 0" class="space-y-4">
							<div>
								<label
									:class="[
										'text-sm block mb-2',
										errorState.invite_code
											? 'text-red-500 dark:text-red-600'
											: 'text-zinc-600 dark:text-zinc-300',
									]"
								>
									{{ $t("authentification.invite_only") }}
								</label>
								<Input
									@entry="(val: string) => (formData.invite_code = val)"
									:error="errorState.invite_code"
									type="text"
									:placeholder="$t('authentification.invite_code')"
									required
									autofocus
								/>
							</div>
						</div>

						<div v-show="step === 1" class="space-y-4">
							<div>
								<label
									:class="[
										'text-sm font-semibold block mb-2',
										errorState.id
											? 'text-red-500 dark:text-red-600'
											: 'text-zinc-600 dark:text-zinc-300',
									]"
								>
									{{ $t("authentification.id") }}
								</label>
								<Input
									@entry="(val: string) => (formData.id = val)"
									:error="errorState.id"
									type="text"
									:placeholder="$t('authentification.id')"
									minlength="2"
									maxlength="15"
									required
									autofocus
								/>
							</div>

							<div>
								<label
									:class="[
										'text-sm font-semibold block mb-2',
										errorState.email
											? 'text-red-500 dark:text-red-600'
											: 'text-zinc-600 dark:text-zinc-300',
									]"
								>
									{{ $t("authentification.email") }}
								</label>
								<Input
									@entry="(val: string) => (formData.email = val)"
									:error="errorState.email"
									type="email"
									:placeholder="$t('authentification.email')"
									required
								/>
							</div>

							<div>
								<label
									:class="[
										'text-sm font-semibold block mb-2',
										errorState.password
											? 'text-red-500 dark:text-red-600'
											: 'text-zinc-600 dark:text-zinc-300',
									]"
								>
									{{ $t("authentification.password") }}
								</label>
								<Input
									@entry="(val: string) => (formData.password = val)"
									:error="errorState.password"
									type="password"
									:placeholder="$t('authentification.password')"
									minlength="8"
									required
								/>
							</div>
						</div>

						<div v-show="step === 2" class="space-y-4">
							<div class="flex flex-col gap-3">
								<NuxtLink
									v-if="data?.terms_of_service"
									tabindex="0"
									:to="data.terms_of_service"
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center gap-2 text-sm text-blue-500 dark:text-blue-400 hover:underline transition-colors"
								>
									{{ $t("authentification.tos") }}
									<ArrowTopRightOnSquareIcon class="size-4" />
								</NuxtLink>
								<NuxtLink
									v-if="data?.privacy_policy"
									tabindex="0"
									:to="data.privacy_policy"
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center gap-2 text-sm text-blue-500 dark:text-blue-400 hover:underline transition-colors"
								>
									{{ $t("authentification.privacy") }}
									<ArrowTopRightOnSquareIcon class="size-4" />
								</NuxtLink>
							</div>

							<p class="text-sm text-zinc-600 dark:text-zinc-400 mt-4">
								{{ $t("authentification.terms") }}
							</p>
						</div>
					</Card>

					<Button
						class="w-full"
						@click="create"
						:type="
							step === 0 ||
							(step === 1 && (data?.terms_of_service || data?.privacy_policy))
								? 'button'
								: 'submit'
						"
					>
						{{
							step === 0
								? $t("next")
								: step === 1 && (data?.terms_of_service || data?.privacy_policy)
									? $t("next")
									: $t("authentification.create")
						}}
					</Button>
				</form>
			</div>
		</div>

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
	</div>
</template>
