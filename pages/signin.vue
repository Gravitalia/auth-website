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
const step = ref(1);
const errorState = reactive({
  url: false,
  email: false,
  password: false,
  mfa: false,
});
const credentials = reactive({
  email: "",
  password: "",
  totpCode: "",
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

const login = (totpCode?: string) => {
  errorState.email = false;
  errorState.password = false;

  if (credentials.email === "" || !isValidEmail(credentials.email)) {
    error("email", "error.form.email");
    return;
  } else if (credentials.password === "" || credentials.password.length < 8) {
    error("password", "error.form.password");
    return;
  }

  if (totpCode) credentials.totpCode = totpCode;

  user
    .signIn(
      credentials.email,
      credentials.password,
      totpCode || credentials.totpCode,
    )
    .then(async () => {
      await navigateTo("/");
    })
    .catch((err: ServerErrorClass) => {
      try {
        if (err.json.errors?.find((e) => e.field === "totpCode")) {
          if (step.value === 1) step.value++;
        } else if (err.json.detail?.includes("no rows")) {
          error("email", "error.form.email");
        } else if (err.json.errors?.find((e) => e.field === "password")) {
          error("password", "error.form.password");
        }
      } catch (_) {
        toast({
          title: t("error.internal_server_error"),
          description: t("error.internal_server_error"),
        });
      }
    });
};

useEnterKey(login);
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
    @submit.prevent="login()"
    class="flex flex-col items-center h-screen gap gap-y-6"
    :style="{
      backgroundImage: 'url(' + data?.background + ')',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    }"
  >
    <!-- Centered card with the form. -->
    <Card class="w-80 lg:w-96" :title="$t('authentification.signin')">
      <!-- Email and password combo. -->
      <div v-show="step === 1">
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

        <div class="flex flex-col flex-grow space-y-2">
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
            @entry="(val: string) => (credentials.email = val)"
            :error="errorState.email"
            autofocus
            required
            type="email"
            :placeholder="$t('authentification.email')"
            class="w-full"
          />

          <p class="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
            {{ $t("authentification.password") }}
            <NuxtLink
              v-if="data?.support"
              tabindex="0"
              :to="data.support"
              class="text-xs text-blue-500 dark:text-blue-400 hover:underline"
            >
              {{ $t("authentification.forgot") }}
            </NuxtLink>
          </p>
          <Input
            @entry="(val: string) => (credentials.password = val)"
            :error="errorState.password"
            required
            type="password"
            minlength="8"
            :placeholder="$t('authentification.password')"
            class="w-full"
          />
        </div>
      </div>
      <!-- If MFA is enabled. -->
      <div v-show="step === 2" class="space-y-2">
        <p class="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
          {{ $t("authentification.mfa") }}
        </p>

        <MultiFactor @code="login" />

        <p
          v-if="data?.support"
          class="text-sm font-semibold text-zinc-600 dark:text-zinc-300"
        >
          <NuxtLink
            tabindex="0"
            :to="data.support"
            class="text-xs text-blue-500 dark:text-blue-400 hover:underline"
          >
            {{ $t("authentification.forgot_mfa") }}
          </NuxtLink>
        </p>
      </div>
    </Card>

    <Button class="w-80 lg:w-96" type="submit">{{
      $t("authentification.signin")
    }}</Button>

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
  </form>
</template>
