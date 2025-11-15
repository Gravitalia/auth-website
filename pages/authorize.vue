<script setup lang="ts">
import { CheckCircleIcon } from "@heroicons/vue/24/outline";
import Button from "~/components/form/Button.vue";
import useKeys from "~/composables/keysManager";
import Card from "~/components/form/Card.vue";

definePageMeta({
	middleware: "auth",
});

const errorState = reactive({
	redirect: false,
	challenge: false,
});

const staticDefaultServer = useRuntimeConfig().public.defaultServer;
const user = useUsers();
const { generateKey } = useKeys();
const userId = user.userData?.id || "";
const server = useCookie("server").value || staticDefaultServer;
const keyId = ref(useCookie("key").value);
const { redirect, challenge: queryChallenge } = useRoute().query;
const step = ref(0);

if (!redirect) errorState.redirect = true;
const { protocol, host, path } = normalizeUrl(
	(redirect as string) || staticDefaultServer,
);

if (!queryChallenge) errorState.challenge = true;

const { data } = await useAppInfo(`${user.protocol}//${user.host}/status.json`);

try {
	if (!keyId.value || keyId.value === "")
		keyId.value = (await generateKey()).id;
} catch (_) {
	// Rejected by user or not focused.
}

if (!errorState.redirect && !errorState.challenge)
	step.value = !keyId.value || keyId.value === "" ? 1 : 2;

const _arrayBufferToBase64Url = (buffer: ArrayBuffer): string => {
	const bytes = new Uint8Array(buffer);
	const binary = String.fromCharCode.apply(null, Array.from(bytes));
	const base64 = window.btoa(binary);
	return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const _base64UrlToArrayBuffer = (base64: string) => {
	base64 = base64.replace(/-/g, "+").replace(/_/g, "/");

	while (base64.length % 4) {
		base64 += "=";
	}

	const binaryString = atob(base64);

	const bytes = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}

	return bytes;
};

const authorize = async () => {
	if (!keyId.value || keyId.value === "")
		return (keyId.value = (await generateKey()).id);
	if (step.value === 1) step.value++;

	const challenge = _base64UrlToArrayBuffer(queryChallenge as string);
	const assertion = (await navigator.credentials.get({
		publicKey: {
			challenge,
			userVerification: "preferred",
		},
	})) as PublicKeyCredential;
	const assertionResponse =
		assertion.response as AuthenticatorAssertionResponse;

	const signature = _arrayBufferToBase64Url(assertionResponse.signature);
	const authenticatorData = _arrayBufferToBase64Url(
		assertionResponse.authenticatorData,
	);
	const clientDataJson = _arrayBufferToBase64Url(
		assertionResponse.clientDataJSON,
	);

	await navigateTo(
		`${protocol}//${host}${path}?signature=${signature}&id=${userId}@${server}&key=${keyId.value}&authenticatorData=${authenticatorData}&clientDataJson=${clientDataJson}`,
		{ external: true },
	);
};
</script>

<template>
	<div
		class="flex flex-col items-center justify-center h-screen"
		:style="{
			backgroundImage: 'url(' + data?.background + ')',
			backgroundRepeat: 'no-repeat',
			backgroundSize: 'cover',
		}"
	>
		<div class="space-y-6">
			<Card class="w-80 lg:w-96" :title="$t('authorize.title', { host })">
				<div v-show="errorState.redirect">
					<p class="flex text-sm text-zinc-600 dark:text-zinc-300">
						{{ $t("authorize.error.redirect") }}
					</p>
				</div>
				<div v-show="errorState.challenge">
					<p class="flex text-sm text-zinc-600 dark:text-zinc-300">
						{{ $t("authorize.error.challenge") }}
					</p>
				</div>
				<div v-show="step === 1">
					<p class="text-sm text-zinc-600 dark:text-zinc-300">
						{{ $t("authorize.create_key") }}
					</p>
				</div>
				<div v-show="step === 2">
					<p class="text-sm">{{ $t("authorize.access.title", { host }) }}</p>
					<p class="flex text-sm text-zinc-600 dark:text-zinc-300">
						<CheckCircleIcon class="size-5 mr-1.5" />
						{{ $t("authorize.access.username") }}
					</p>
				</div>
			</Card>

			<Button v-show="step !== 0" class="w-80 lg:w-96" @click="authorize">{{
				$t("authentification.signin")
			}}</Button>
		</div>
	</div>
</template>
