<script setup lang="ts">
import HostModal from "~/components/authentification/HostModal.vue";
import MultiFactor from "~/components/authentification/MultiFactor.vue";
import TrustModal from "~/components/authentification/TrustModal.vue";
import Button from "~/components/form/Button.vue";
import ButtonInvisible from "~/components/form/ButtonInvisible.vue";
import Card from "~/components/form/Card.vue";
import Input from "~/components/form/Input.vue";
import useEnterKey from "~/composables/useEnterKey";
import type { AppInfo } from "~/types";
import { ServerErrorClass } from "~/types";
import { useUsers } from "~/stores/users";
import { toast } from "~/composables/useToast";

interface ErrorState {
	url: boolean;
	email: boolean;
	password: boolean;
	mfa: boolean;
}

interface Credentials {
	email: string;
	password: string;
	totpCode: string;
}

interface TrustServer {
	server: string;
	shown: boolean;
}

const staticDefaultServer = useRuntimeConfig().public.defaultServer;
const { t } = useI18n();
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
const step = ref<number>(1);
const errorState = reactive<ErrorState>({
	url: false,
	email: false,
	password: false,
	mfa: false,
});
const credentials = reactive<Credentials>({
	email: "",
	password: "",
	totpCode: "",
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

const login = async (totpCode?: string): Promise<void> => {
	errorState.email = false;
	errorState.password = false;

	if (!credentials.email || !isValidEmail(credentials.email)) {
		handleError("email", "error.form.email");
		return;
	}

	if (!credentials.password || credentials.password.length < 8) {
		handleError("password", "error.form.password");
		return;
	}

	if (totpCode) {
		credentials.totpCode = totpCode;
	}

	try {
		const response = await user.signIn(
			credentials.email,
			credentials.password,
			totpCode || credentials.totpCode,
		);

		if (response) {
			await navigateTo(useRedirect("/"));
		}
	} catch (err) {
		const error = err as ServerErrorClass;
		try {
			if (error.json?.errors?.some((e) => e.field === "totpCode")) {
				if (step.value === 1) {
					step.value = 2;
				}
			} else if (
				error.json?.detail?.includes("no rows") ||
				error.json?.detail?.includes("email")
			) {
				handleError("email", "error.form.email");
			} else if (error.json?.errors?.some((e) => e.field === "password")) {
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

useEnterKey(() => login());
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
				<form @submit.prevent="login()" class="space-y-6">
					<Card :title="$t('authentification.signin')">
						<div v-show="step === 1" class="space-y-4">
							<div>
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
									@entry="(val: string) => (credentials.email = val)"
									:error="errorState.email"
									type="email"
									:placeholder="$t('authentification.email')"
									required
									autofocus
								/>
							</div>

							<div>
								<div class="flex items-center justify-between mb-2">
									<label
										:class="[
											'text-sm font-semibold',
											errorState.password
												? 'text-red-500 dark:text-red-600'
												: 'text-zinc-600 dark:text-zinc-300',
										]"
									>
										{{ $t("authentification.password") }}
									</label>
									<NuxtLink
										v-if="data?.support"
										tabindex="0"
										:to="data.support"
										class="text-xs text-blue-500 dark:text-blue-400 hover:underline transition-colors"
									>
										{{ $t("authentification.forgot") }}
									</NuxtLink>
								</div>
								<Input
									@entry="(val: string) => (credentials.password = val)"
									:error="errorState.password"
									type="password"
									:placeholder="$t('authentification.password')"
									minlength="8"
									required
								/>
							</div>
						</div>

						<div v-show="step === 2" class="space-y-4">
							<div>
								<p
									class="text-sm font-semibold text-zinc-600 dark:text-zinc-300 mb-4"
								>
									{{ $t("authentification.mfa") }}
								</p>
								<MultiFactor @code="login" />
							</div>

							<p
								v-if="data?.support"
								class="text-xs text-zinc-600 dark:text-zinc-400"
							>
								<NuxtLink
									tabindex="0"
									:to="data.support"
									class="text-blue-500 dark:text-blue-400 hover:underline transition-colors"
								>
									{{ $t("authentification.forgot_mfa") }}
								</NuxtLink>
							</p>
						</div>
					</Card>

					<Button class="w-full" type="submit">
						{{ $t("authentification.signin") }}
					</Button>
				</form>
			</div>
		</div>

		<footer
			class="bg-white dark:bg-zinc-950 flex justify-center w-full h-24 border-t border-zinc-200 dark:border-zinc-800 mt-auto"
		>
			<NuxtLink
				tabindex="0"
				to="/signup"
				class="mt-10 text-blue-500 dark:text-blue-400 hover:underline"
			>
				{{ $t("authentification.create_account") }}
			</NuxtLink>
		</footer>
	</div>
</template>
