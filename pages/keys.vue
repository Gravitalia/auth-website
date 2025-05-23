<script setup lang="ts">
import useKeys from "~/composables/keysManager";

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});
const { keys, generateKey, deleteKey } = useKeys();
</script>

<template>
  <div class="flex flex-col justify-center items-center mt-16 gap-4">
    <FormButtonInvisible @click="generateKey" class="w-80 md:w-1/2 lg:w-1/3">{{
      $t("keys.generate")
    }}</FormButtonInvisible>

    <FormCard :title="$t('keys.title')" class="md:w-1/2 lg:w-1/3 gap-4">
      <div v-for="key in keys" class="flex justify-between">
        <div>
          <p>
            {{ $t("keys.description", { id: key.id, date: key.createdAt }) }}
          </p>
          <NuxtLink
            :to="
              'data:application/x-pem-file;charset=utf-8,' + key.publicKeyPem
            "
            download="publicKey.pem"
            class="flex text-sm text-blue-500 dark:text-blue-400 hover:underline"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-4 mt-0.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
            {{ $t("keys.download") }}</NuxtLink
          >
        </div>

        <FormButtonInvisible class="w-32 xl:w-52" @click="deleteKey(key.id)"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
          <span class="mt-0.5 ml-1.5">{{ $t("keys.delete") }}</span>
        </FormButtonInvisible>
      </div>
      <div v-if="keys.length === 0">
        <p class="text-sm">{{ $t("keys.empty") }}</p>
      </div>
    </FormCard>
  </div>
</template>
