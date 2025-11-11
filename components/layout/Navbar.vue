<script setup lang="ts">
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/vue/24/outline";

const path = computed(() => useRoute().path);
const links = [
	{
		name: "navbar.profile",
		path: "/",
	},
	{
		name: "navbar.keys",
		path: "/keys",
	},
	{
		name: "navbar.account",
		path: "/account",
	},
];

const user = useUsers();
const logout = async () => {
	user.logout();
	await navigateTo("/signin");
};

const { data } = await useAppInfo(`${user.host}/status.json`);
</script>

<template>
	<nav
		class="flex items-center justify-between bg-white dark:bg-zinc-900 px-4 md:px-24 py-3 shadow-sm rounded-t-md"
	>
		<div class="flex items-center space-x-10">
			<NuxtLink to="https://www.gravitalia.com/">
				<NuxtImg v-if="data?.favicon" :src="data.favicon" class="size-10" />
			</NuxtLink>

			<div class="flex space-x-6 text-sm font-medium">
				<NuxtLink
					v-for="link in links"
					:key="link.path"
					:to="link.path"
					:aria-label="$t(link.name)"
					:aria-current="link.path === path ? 'page' : null"
					:class="[
						'relative transition group',
						link.path === path
							? ''
							: 'text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white',
					]"
				>
					{{ $t(link.name) }}
					<span
						:class="[
							'absolute left-0 -bottom-full h-[2px] w-full bg-black dark:bg-white rounded-full transition-opacity',
							link.path === path
								? 'opacity-100'
								: 'opacity-0 group-hover:opacity-100',
						]"
					></span>
				</NuxtLink>
			</div>
		</div>

		<div class="flex flex-col items-center space-x-4">
			<FormButtonInvisible
				@click="logout"
				class="hidden md:block border-none px-4"
			>
				{{ $t("navbar.logout") }}
			</FormButtonInvisible>
			<FormButtonInvisible
				@click="logout"
				class="block md:hidden border-none px-4"
			>
				<ArrowLeftStartOnRectangleIcon class="size-6" />
				<span class="sr-only">{{ $t("navbar.logout") }}</span>
			</FormButtonInvisible>
		</div>
	</nav>
</template>
