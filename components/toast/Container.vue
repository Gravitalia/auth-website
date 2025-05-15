<script setup lang="ts">
import { toasts } from "~/composables/useToast";
</script>

<template>
  <div class="fixed bottom-4 right-4 flex flex-col space-y-2 z-50">
    <Toast
      v-for="t in toasts"
      :key="t.id"
      :title="t.title"
      :description="t.description"
    />
  </div>
</template>
