<script setup lang="ts">
import MultiFactor from "~/components/authentification/MultiFactor.vue";
import Button from "~/components/form/Button.vue";
import ButtonInvisible from "~/components/form/ButtonInvisible.vue";
import Card from "~/components/form/Card.vue";
import Input from "~/components/form/Input.vue";
import Modal from "~/components/modal/Modal.vue";
import useEnterKey from "~/composables/useEnterKey";
import fetchServerConfiguration from "~/utils/fetchServerConfiguration";

const isModalVisible = ref(false);
const temporaryHostUrl = ref("");
const step = ref(1);
const errorState = reactive({
  url: false,
  email: false,
  password: false,
  mfa: false,
});
const formData = reactive({
  hoister: "",
  email: "",
  password: "",
});

const closeModal = () => {
  isModalVisible.value = false;
};
const finishModal = async () => {
  fetchServerConfiguration(temporaryHostUrl.value)
    .then((res) => {
      console.log(res);
      formData.hoister = temporaryHostUrl.value;
      closeModal();
    })
    .catch((_e) => {
      errorState.url = true;
    });
};

const url = (url: string) => {
  if (isValidServer(url)) {
    errorState.url = false;
    temporaryHostUrl.value = url;
  } else {
    errorState.url = true;
  }
};

const login = (code?: string) => {
  errorState.email = false;

  if (formData.email === "" || !isValidEmail(formData.email)) {
    errorState.email = true;
    return;
  }

  step.value++;

  alert(`Code: ${code}`);
};

useEnterKey(login);
</script>

<template>
  <!-- Hosting provider edit modal dialog. -->
  <Modal
    :title="$t('authentification.host_provider')"
    :description="$t('authentification.select_host_provider')"
    :visible="isModalVisible"
    :disabled-button="errorState.url"
    @close="closeModal"
    @finish="finishModal"
  >
    <!-- Use Gravitalia by default. -->
    <ButtonInvisible
      @click="(temporaryHostUrl = 'auth.gravitalia.com'), finishModal()"
      class="mt-2 w-full"
    >
      Gravitalia
      <span class="mt-0.5 ml-2 text-xs text-zinc-600 dark:text-zinc-300">{{
        $t("recommended")
      }}</span>
    </ButtonInvisible>

    <div class="inline-flex items-center justify-center w-full">
      <hr class="w-full my-4 border-zinc-200 dark:border-zinc-800" />
      <span
        class="absolute px-3 font-medium text-zinc-600 dark:text-zinc-300 -translate-x-1/2 bg-white dark:bg-zinc-950 left-1/2"
        >{{ $t("or") }}</span
      >
    </div>

    <!-- Enter custom server. -->
    <Input
      @entry="url"
      :error="errorState.url"
      :success="
        !errorState.url && (formData.hoister !== '' || temporaryHostUrl !== '')
      "
      type="url"
      :value="formData.hoister"
      class="w-full"
      :placeholder="$t('authentification.server_addr')"
    />
  </Modal>

  <div
    class="flex flex-col items-center h-screen gap gap-y-6"
    style="background-image: url(&quot;&quot;)"
  >
    <!-- Centered card with the form. -->
    <Card :title="$t('authentification.signin')">
      <!-- Email and password combo. -->
      <div v-show="step === 1">
        <div class="flex flex-col flex-grow">
          <!-- Section to open modal and update hosting provider. -->
          <p class="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
            {{ $t("authentification.host_provider") }}
          </p>
          <ButtonInvisible @click="isModalVisible = true" class="mt-2 w-full">
            {{ $t("default") }}
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
            @entry="(val: string) => (formData.email = val)"
            :error="errorState.email"
            autofocus
            type="email"
            :placeholder="$t('authentification.email')"
            class="w-full"
          />

          <p class="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
            {{ $t("authentification.password") }}
            <NuxtLink
              tabindex="0"
              to="mailto:support@gravitalia.com"
              class="text-xs text-blue-500 dark:text-blue-400 hover:underline"
            >
              {{ $t("authentification.forgot") }}
            </NuxtLink>
          </p>
          <Input
            @entry="(val: string) => (formData.password = val)"
            :error="errorState.password"
            type="password"
            :placeholder="$t('authentification.password')"
            class="w-full"
          />
        </div>
      </div>
      <!-- If MFA is enabled. -->
      <div v-show="step === 2">
        <p class="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
          {{ $t("authentification.mfa") }}
        </p>

        <MultiFactor @code="login" />
      </div>
    </Card>

    <Button @click="login()" class="w-96">{{
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
  </div>
</template>
