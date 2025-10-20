<script setup lang="ts">
import type { AppInfo } from "~/types";
import ButtonInvisible from "../form/ButtonInvisible.vue";
import Input from "../form/Input.vue";
import Modal from "../modal/Modal.vue";

let { visible } = defineProps({
	visible: Boolean,
	defaultValue: String,
});

const emit = defineEmits<{
	(e: "host", url?: string, info?: AppInfo): void;
}>();

const defaultServer = useRuntimeConfig().public.defaultServer;
const temporaryHostUrl = ref("");
const fakeUrl = ref(false);

const url = (url: string) => {
	if (isValidServer(url)) {
		fakeUrl.value = false;
		temporaryHostUrl.value = url;
	} else {
		fakeUrl.value = true;
	}
};

const end = (host?: string) => {
	if (host) {
		fetchServerConfiguration(host)
			.then((res) => {
				emit("host", host, res);
				end();
			})
			.catch((_e) => {
				fakeUrl.value = true;
			});
	} else {
		emit("host", undefined, undefined);
	}
};
</script>

<template>
	<Modal
		:title="$t('authentification.host_provider')"
		:description="$t('authentification.select_host_provider')"
		:visible="visible"
		:disabled-button="fakeUrl"
		@close="end()"
		@finish="end(temporaryHostUrl)"
	>
		<!-- Use Gravitalia by default. -->
		<ButtonInvisible @click="end(defaultServer)" class="mt-2 w-full">
			Gravitalia
			<span class="mt-0.5 ml-2 text-xs text-zinc-600 dark:text-zinc-300">{{
				$t("recommended")
			}}</span>
		</ButtonInvisible>

		<div class="inline-flex items-center justify-center w-full">
			<hr class="w-full my-4 border-zinc-200 dark:border-zinc-800" />
			<span
				class="absolute px-3 font-medium text-zinc-600 dark:text-zinc-300 -translate-x-1/2 bg-white dark:bg-zinc-950 left-1/2"
				>{{ $t("or") }}</span
			>
		</div>

		<!-- Enter custom server. -->
		<Input
			@entry="url"
			:error="fakeUrl"
			:success="!fakeUrl && temporaryHostUrl !== ''"
			type="url"
			:value="defaultValue"
			class="w-full"
			:placeholder="$t('authentification.server_addr')"
		/>
	</Modal>
</template>
