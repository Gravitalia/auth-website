<script setup lang="ts">
import Button from "~/components/form/Button.vue";
import useKeys from "~/composables/keysManager";

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
const keyId = ref(useCookie("key").value);
const { redirect, challenge: queryChallenge } = useRoute().query;
const step = ref(0);

if (!redirect) errorState.redirect = true;
const { protocol, host } = normalizeUrl(
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
console.log(!errorState.challenge);

const _arrayBufferToBase64 = (buffer: any) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary);
};

const _base64ToArrayBuffer = (base64: string) => {
  const binaryString = atob(base64);

  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
};

const login = async () => {
  if (!keyId.value || keyId.value === "")
    return (keyId.value = (await generateKey()).id);
  if (step.value === 1) step.value++;

  const challenge = _base64ToArrayBuffer(queryChallenge as string);
  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge,
      userVerification: "preferred",
    },
  });

  const signature = btoa(assertion.response.signature);
  const authenticatorData = _arrayBufferToBase64(
    assertion.response.authenticatorData,
  );
  const clientDataJson = _arrayBufferToBase64(
    assertion.response.clientDataJSON,
  );

  await navigateTo(
    `${protocol}//${host}?signature=${signature}&id=${userId}&key=${keyId.value}&authenticatorData=${authenticatorData}&clientDataJson=${clientDataJson}`,
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
    <form @submit.prevent="login" class="space-y-6">
      <FormCard class="w-80 lg:w-96" :title="$t('authorize.title', { host })">
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-5 mr-1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>

            {{ $t("authorize.access.username") }}
          </p>
        </div>
      </FormCard>

      <Button v-show="step !== 0" class="w-80 lg:w-96" type="submit">{{
        $t("authentification.signin")
      }}</Button>
    </form>
  </div>
</template>
