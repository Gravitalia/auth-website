<script setup lang="ts">
import Button from "~/components/form/Button.vue";
import useKeys from "~/composables/keysManager";

definePageMeta({
  middleware: "auth",
});

const user = useUsers();
const { generateKey } = useKeys();
const userId = user.userData?.id || "";
const keyId = ref(useCookie("key").value);
const { redirect, challenge: queryChallenge } = useRoute().query;
const step = ref(!keyId.value || keyId.value === "" ? 1 : 2);
const { protocol, host } = normalizeUrl(redirect as string);

const { data } = await useAppInfo(
  `${user.protocol}//${user.host}/status.json`,
);

try {
  if (!keyId.value || keyId.value === "")
    keyId.value = (await generateKey()).id;
} catch (_) {
  // Rejected by user or not focused.
}

const _arrayBufferToBase64 = (buffer: any) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary);
};

const login = async () => {
  if (!keyId.value || keyId.value === "")
    return (keyId.value = (await generateKey()).id);
  if (step.value === 1) step.value++;

  const challenge =
    /*queryChallenge ? atob(queryChallenge as string) : */ crypto.getRandomValues(
      new Uint8Array(32),
    );
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
  <div class="flex flex-col items-center justify-center h-screen"  :style="{
      backgroundImage: 'url(' + data?.background + ')',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    }">
    <form @submit.prevent="login" class="gap-4">
      <FormCard class="w-80 lg:w-96" :title="'Se connecter à ' + host">
        <div v-show="step === 1">
          <p class="text-sm text-zinc-600 dark:text-zinc-300">
            Vous devez créer une clé associée à votre compte. Elle comprend une
            clé privée stockée sur votre ordinateur (et jamais transmise !) et
            une clé publique. Suivez les instructions de votre navigateur ou
            cliquez sur le bouton ci-dessous. Elle vous permet de vous connecter
            de manière décentralisée.
          </p>
        </div>
        <div v-show="step === 2">
          <p class="text-sm text-zinc-600 dark:text-zinc-300">
            Autoriser {{ host }} à accéder à votre nom d'utilisateur
          </p>
        </div>
      </FormCard>

      <Button class="w-80 lg:w-96" type="submit">{{
        $t("authentification.signin")
      }}</Button>
    </form>
  </div>
</template>
