<script setup lang="ts">
import ModalFooter from "./ModalFooter.vue";
import ModalHeader from "./ModalHeader.vue";

defineProps({
  title: String,
  description: String,
  visible: Boolean,
  disabledButton: Boolean,
});

defineEmits(["close", "finish"]);
</script>

<template>
  <Teleport to="body">
    <!-- Put modal over others elements. -->
    <div v-show="visible" class="relative z-10" role="dialog" aria-modal="true">
      <!-- Add a blured font to highlight modal. -->
      <div class="fixed inset-0 bg-zinc-900/75" aria-hidden="true"></div>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <div
            class="relative transform overflow-hidden rounded bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg"
          >
            <div class="px-3 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div
                  class="w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"
                >
                  <!-- Modal header. -->
                  <ModalHeader
                    :title="title"
                    :description="description"
                    @close="$emit('close')"
                  />
                  <div class="mt-6">
                    <slot />
                  </div>
                </div>
              </div>
            </div>
            <ModalFooter
              :disabledButton="disabledButton"
              @finish="$emit('finish')"
            />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
