<script setup lang="ts">
import { useTotp } from "~/composables/useTotp";
import Input from "../form/Input.vue";
import { toast } from "~/composables/useToast";
import type { ServerErrorClass } from "~/types";
import QRCode from "~/components/qrcode/QRCode.vue";

const user = useUsers();
const { generate } = useTotp();
const data = reactive({
	secret: "",
	code: "",
	password: "",
});
const dataUri = ref("");

defineProps({
	visible: Boolean,
});

const { t } = useI18n();
const emit = defineEmits(["close"]);
const close = () => emit("close");
const finish = () => {
	user
		.updateMe({
			totpSecret: data.secret,
			totpCode: data.code,
			password: data.password,
		})
		.catch((_: ServerErrorClass) => {})
		.then((_) => {
			toast({
				title: t("profile.toast.title"),
				description: t("profile.toast.totp"),
			}),
				emit("close");
		});
};

onMounted(() => {
	data.secret = generate();
	dataUri.value = encodeURI(
		`otpauth://totp/${user.userData.id}?secret=${data.secret}&issuer=Gravitalia`,
	);
});
</script>

<template>
	<Modal
		@close="close"
		@finish="finish"
		:title="$t('profile.totp.title')"
		:visible
	>
		<div class="md:flex">
			<QRCode class="hidden md:block" :data-uri />
			<div class="mt-2">
				<div class="hidden md:block">
					<h3 class="font-semibold">{{ $t("profile.totp.scan.title") }}</h3>
					<p class="text-sm max-w-sm">
						{{ $t("profile.totp.scan.description") }}
					</p>
				</div>

				<br />

				<h3 class="font-semibold">{{ $t("profile.totp.manual") }}</h3>
				<p class="text-sm">
					{{ data.secret }}
				</p>
			</div>
		</div>

		<Input
			v-model="data.code"
			type="text"
			required
			class="mt-4 w-full"
			min="2"
			max="8"
			:placeholder="$t('profile.totp.code')"
		/>

		<Input
			v-model="data.password"
			type="password"
			required
			class="mt-4 w-full"
			:placeholder="$t('authentification.password')"
		/>
	</Modal>
</template>
