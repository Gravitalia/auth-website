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
const errorState = reactive({
	totp: false,
	password: false,
});

defineProps({
	visible: Boolean,
});

const { t } = useI18n();
const emit = defineEmits(["close"]);
const close = () => emit("close");
const finish = () => {
	errorState.totp = false;
	errorState.password = false;

	if (data.code === "" || data.code.length !== 6) {
		errorState.totp = true;
		return;
	}

	if (data.password === "") {
		errorState.password = true;
		return;
	}

	user
		.updateMe({
			totpSecret: data.secret,
			totpCode: data.code,
			password: data.password,
		})
		.then((_) => {
			toast({
				title: t("profile.toast.title"),
				description: t("profile.toast.totp"),
			});
			emit("close");
		})
		.catch((err: ServerErrorClass) => {
			if (err.json.errors?.find((e) => e.field === "password")) {
				errorState.password = true;
			} else {
				errorState.totp = true;
			}
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
			autofocus
			required
			class="mt-4 w-full"
			min="2"
			max="8"
			:error="errorState.totp"
			:placeholder="$t('profile.totp.code')"
		/>

		<Input
			v-model="data.password"
			type="password"
			required
			class="mt-4 w-full"
			:error="errorState.password"
			:placeholder="$t('authentification.password')"
		/>
	</Modal>
</template>
