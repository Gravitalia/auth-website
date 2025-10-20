<script setup lang="ts">
import Input from "../form/Input.vue";
import { toast } from "~/composables/useToast";

const errorState = reactive({});

defineProps({
	visible: Boolean,
});

const { t } = useI18n();
const emit = defineEmits(["close"]);
const close = () => emit("close");
const finish = () => {
	toast({
		title: t("profile.toast.title"),
		description: t("profile.toast.password"),
	});
	emit("close");
};
</script>

<template>
	<Modal
		@close="close"
		@finish="finish"
		:title="$t('profile.password.title')"
		:visible
	>
		<Input
			type="password"
			required
			class="w-full"
			:placeholder="$t('profile.password.new')"
		/>

		<Input
			type="password"
			required
			class="w-full mt-4"
			:placeholder="$t('profile.password.old')"
		/>
	</Modal>
</template>
