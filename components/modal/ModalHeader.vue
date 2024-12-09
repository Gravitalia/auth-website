<script setup lang="ts">
defineEmits(["close"]);
defineProps(["title", "description"]);
</script>

<template>
  <div class="flex justify-between">
    <h3 class="text-xl font-semibold">{{ title }}</h3>
    <svg
      @click="$emit('close')"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="mt-1.5 size-4 cursor-pointer"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  </div>
  <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
    {{ description }}
  </p>
</template>
