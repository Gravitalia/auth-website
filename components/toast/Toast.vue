<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/outline";

defineProps({
  title: String,
  description: String,
});
</script>

<template>
  <div
    tabindex="-1"
    class="fixed top-0 flex max-h-screen w-full p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-md"
  >
    <div
      class="group relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md p-4 pr-6 shadow transition-all border bg-background text-foreground"
    >
      <div class="grid gap-1">
        <div class="text-sm font-semibold">
          {{ title }}
        </div>
        <div class="text-sm text-zinc-600 dark:text-zinc-300">
          {{ description }}
        </div>
      </div>
      <button
        type="button"
        class="absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100"
      >
        <XMarkIcon class="size-4" />
      </button>
    </div>
  </div>
</template>
