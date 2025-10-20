<script setup lang="ts">
import type { AppInfo } from "~/types";
import ButtonInvisible from "../form/ButtonInvisible.vue";
import Button from "../form/Button.vue";

let { visible } = defineProps({
	visible: Boolean,
	server: String,
});

const emit = defineEmits<{
	(e: "host", url?: string, info?: AppInfo): void;
}>();

const end = (host?: string) => {
	if (host) {
		fetchServerConfiguration(host)
			.then((res) => {
				emit("host", host, res);
				end();
			})
			.catch((_e) => {
				emit("host", undefined, undefined);
			});
	} else {
		emit("host", undefined, undefined);
	}
};
</script>

<template>
	<Teleport to="body">
		<!-- Put modal over others elements. -->
		<div v-if="visible" class="relative z-10" role="dialog" aria-modal="true">
			<!-- Add a blured font to highlight modal. -->
			<div class="fixed inset-0 bg-zinc-900/75" aria-hidden="true"></div>

			<div
				class="fixed inset-0 flex items-center justify-center overflow-y-auto"
			>
				<div class="flex items-end justify-center p-2 text-center w-screen">
					<div
						class="relative transform overflow-hidden rounded bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-left w-screen max-w-lg"
					>
						<div class="px-3 pt-5 pb-4 sm:p-6 sm:pb-4">
							<div class="sm:flex sm:items-start">
								<div
									class="w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"
								>
									<!-- Modal header. -->
									<ModalHeader
										:title="$t('authentification.trust.title')"
										:description="
											$t('authentification.trust.description', { server })
										"
										@close="end(undefined)"
									/>
								</div>
							</div>
						</div>
						<div class="px-8 py-3 grid gap-4 grid-cols-2">
							<ButtonInvisible @click="end(undefined)" tabindex="0">
								{{ $t("authentification.trust.use_default") }}
							</ButtonInvisible>

							<Button @click="end(server)" tabindex="0">
								{{ $t("authentification.trust.trust") }}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
