<script setup lang="ts">
import { ChevronRightIcon } from "@heroicons/vue/24/outline";
import DeleteModal from "~/components/profile/DeleteModal.vue";
import Card from "~/components/form/Card.vue";
import ButtonInvisible from "~/components/form/ButtonInvisible.vue";

definePageMeta({
	middleware: "auth",
	layout: "dashboard",
});

const user = useUsers();
const visible = ref(false);

const download = () => {
	const data = {
		user: user.userData,
		server: {
			hostname: user.host,
			protocol: user.protocol,
		},
		token: user._token,
	};
	const blob = new Blob([JSON.stringify(data)], { type: "application/json" });

	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `${user.userData.id}@${user.host}.json`;

	document.body.appendChild(a);
	a.click();

	document.body.removeChild(a);
	URL.revokeObjectURL(url);
};
</script>

<template>
	<DeleteModal @close="visible = false" :visible />

	<div class="flex flex-col justify-center items-center mt-16 gap-4 mx-2">
		<Card :title="$t('account.download.title')" class="w-full lg:w-2/5">
			<ButtonInvisible
				@click="download"
				class="w-full px-4 flex justify-between"
			>
				<p>{{ $t("account.download.button") }}</p>
				<ChevronRightIcon class="mt-0.5 size-4" />
			</ButtonInvisible>
		</Card>

		<Card :title="$t('account.delete.title')" class="w-full lg:w-2/5">
			<ButtonInvisible
				@click="visible = true"
				class="w-full px-4 flex justify-between"
			>
				<p>{{ $t("account.delete.title") }}</p>
				<ChevronRightIcon class="mt-0.5 size-4" />
			</ButtonInvisible>
		</Card>
	</div>
</template>
