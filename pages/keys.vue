<script setup lang="ts">
import { DocumentTextIcon, TrashIcon } from "@heroicons/vue/24/outline";
import useKeys from "~/composables/keysManager";
import Card from "~/components/form/Card.vue";
import ButtonInvisible from "~/components/form/ButtonInvisible.vue";

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});
const { keys, generateKey, deleteKey } = useKeys();
</script>

<template>
  <div class="flex flex-col justify-center items-center mt-16 gap-4">
    <ButtonInvisible @click="generateKey" class="w-80 md:w-1/2 lg:w-1/3">{{
      $t("keys.generate")
    }}</ButtonInvisible>

    <Card :title="$t('keys.title')" class="md:w-1/2 lg:w-1/3 gap-4">
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
          >
            <DocumentTextIcon class="size-4 mt-0.5" />
            {{ $t("keys.download") }}</NuxtLink
          >
        </div>

        <ButtonInvisible class="w-32 xl:w-52" @click="deleteKey(key.id)">
          <TrashIcon class="size-6" />
          <span class="mt-0.5 ml-1.5">{{ $t("keys.delete") }}</span>
        </ButtonInvisible>
      </div>
      <div v-if="keys.length === 0">
        <p class="text-sm">{{ $t("keys.empty") }}</p>
      </div>
    </Card>
  </div>
</template>
