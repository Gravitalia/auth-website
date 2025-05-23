<script setup lang="ts">
import { useTotp } from "~/composables/useTotp";
import Input from "../form/Input.vue";
import { toast } from "~/composables/useToast";
import type { ServerErrorClass } from "~/types";

const user = useUsers();
const { generate } = useTotp();
const data = reactive({
  secret: "",
  code: "",
  password: "",
});

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
});
</script>

<template>
  <Modal
    @close="close"
    @finish="finish"
    :title="$t('profile.totp.title')"
    :visible
  >
    <p>
      <span class="font-bold">{{ data.secret }}</span>
      {{ $t("profile.totp.description") }}
    </p>
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
      type="text"
      required
      class="mt-4 w-full"
      :placeholder="$t('authentification.password')"
    />
  </Modal>
</template>
