<script setup lang="ts">
import ButtonInvisible from "../form/ButtonInvisible.vue";

defineEmits(["finish"]);
defineProps(["disabledButton"]);
</script>

<template>
  <div class="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
    <ButtonInvisible
      :disabled="disabledButton"
      @click="$emit('finish')"
      class="px-3"
    >
      {{ $t("modal.done") }}
    </ButtonInvisible>
  </div>
</template>
