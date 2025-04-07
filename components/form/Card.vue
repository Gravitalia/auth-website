<script setup>
const props = defineProps({
  title: String,
});
</script>

<template>
  <div
    class="bg-white dark:bg-zinc-950 w-80 lg:w-96 h-auto border border-zinc-200 dark:border-zinc-800 p-8 mt-auto flex flex-col"
  >
    <!-- Title of the card. -->
    <h1 class="text-xl font-bold mb-6">
      {{ title }}
    </h1>

    <slot />
  </div>
</template>
