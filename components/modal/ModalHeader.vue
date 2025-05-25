<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/outline";

defineEmits(["close"]);
defineProps(["title", "description"]);
</script>

<template>
  <div class="flex justify-between">
    <h3 class="text-xl font-semibold">{{ title }}</h3>
    <XMarkIcon class="mt-1.5 size-4 cursor-pointer" />
  </div>
  <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
    {{ description }}
  </p>
</template>
