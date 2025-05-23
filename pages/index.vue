<script setup lang="ts">
import Input from "~/components/form/Input.vue";
import TotpModal from "~/components/profile/TotpModal.vue";
import type { ServerErrorClass } from "~/types";

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

const user = useUsers();
const { t } = useI18n();

const errorState = reactive({
  username: false,
  email: false,
  password: false,
});
const credentials = reactive({
  username: "",
  email: "",
  password: "",
});
const modals = reactive({
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
  errorState.email = false;
  errorState.password = false;

  if (
    credentials.username.length !== 0 &&
    credentials.username !== user.userData.preferredUsername
  ) {
    user
      .updateMe({ username: credentials.username })
      .catch((_) => {
        errorState.username = true;
      })
      .then((_) => {
        user.userData.preferredUsername = credentials.username;
        success();
      });
  }

  if (credentials.email.length !== 0) {
    if (credentials.password.length === 0) return (errorState.password = true);

    user
      .updateMe({ email: credentials.email, password: credentials.password })
      .catch((err: ServerErrorClass) => {
        if (err.json.errors?.find((e) => e.field === "password")) {
          errorState.password = true;
        } else {
          errorState.email = true;
        }
      })
      .then((_) => success());
  }
};
</script>

<template>
  <LazyProfilePasswordModal
    @close="modals.password = false"
    :visible="modals.password"
  />

  <TotpModal @close="modals.totp = false" :visible="modals.totp" />

  <div class="flex flex-col justify-center items-center mt-16 gap-4">
    <FormButtonInvisible @click="save" class="w-80 md:w-1/2 lg:w-1/3">{{
      $t("profile.save")
    }}</FormButtonInvisible>

    <FormCard :title="$t('profile.my_profile')" class="md:w-1/2 lg:w-1/3">
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
    </FormCard>

    <FormCard :title="$t('profile.contact_info')" class="md:w-1/2 lg:w-1/3">
      <div>
        <label class="text-sm">
          {{ $t("authentification.email") }}
        </label>
        <Input
          autofocus
          v-model="credentials.email"
          type="email"
          :placeholder="$t('authentification.email')"
          :error="errorState.email"
          class="w-full"
        />
      </div>
      <div class="mt-4">
        <label class="text-sm">
          {{ $t("authentification.password") }}
        </label>
        <Input
          v-model="credentials.password"
          autofocus
          type="password"
          :placeholder="$t('authentification.password')"
          :error="errorState.password"
          class="w-full"
        />
      </div>

      <p class="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
        {{ $t("profile.password_required") }}
      </p>
    </FormCard>

    <FormCard :title="$t('profile.security')" class="md:w-1/2 lg:w-1/3">
      <FormButtonInvisible
        @click="modals.password = true"
        class="w-full px-4 flex justify-between"
      >
        <p>{{ $t("profile.password.title") }}</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="mt-0.5 size-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </FormButtonInvisible>

      <FormButtonInvisible
        @click="modals.totp = true"
        class="mt-4 w-full px-4 flex justify-between"
      >
        <p>{{ $t("profile.totp.button") }}</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="mt-0.5 size-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </FormButtonInvisible>
    </FormCard>
  </div>
</template>
