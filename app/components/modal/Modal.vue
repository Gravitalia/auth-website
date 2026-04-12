<script setup lang="ts">
import ModalFooter from "./ModalFooter.vue";
import ModalHeader from "./ModalHeader.vue";

interface Props {
	title?: string;
	description?: string;
	visible: boolean;
	disabledButton?: boolean;
}

interface Emits {
	(e: "close"): void;
	(e: "finish"): void;
}

defineProps<Props>();

const handleEscapeKey = (e: KeyboardEvent) => {
	if (e.key === "Escape") {
		const props = defineProps<Props>();
		if (props.visible) {
			emit("close");
			e.preventDefault();
		}
	}
};

const emit = defineEmits<Emits>();

onMounted(() => {
	window.addEventListener("keydown", handleEscapeKey);
});

onUnmounted(() => {
	window.removeEventListener("keydown", handleEscapeKey);
});
</script>

<template>
	<Teleport to="body">
		<Transition name="fade">
			<div
				v-show="visible"
				class="relative z-50"
				role="dialog"
				aria-modal="true"
			>
				<div
					class="fixed inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/40 backdrop-blur-sm"
					aria-hidden="true"
					@click="emit('close')"
				></div>

				<div
					class="fixed inset-0 flex items-center justify-center overflow-y-auto p-4"
				>
					<Transition name="modal-slide">
						<div class="flex items-center justify-center w-full">
							<div
								class="relative w-full max-w-lg rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
								@click.stop
							>
								<div
									class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
								></div>

								<div class="px-6 pt-6 pb-4">
									<div>
										<ModalHeader
											:title="title"
											:description="description"
											@close="emit('close')"
										/>
										<div class="mt-6">
											<slot />
										</div>
									</div>
								</div>

								<ModalFooter
									:disabledButton="disabledButton"
									@finish="emit('finish')"
								/>

								<div
									class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
								></div>
							</div>
						</div>
					</Transition>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>
