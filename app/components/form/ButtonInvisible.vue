<template>
	<button
		type="button"
		tabindex="0"
		class="px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ease-out"
		:class="[
			'bg-transparent',
			'border border-zinc-300 dark:border-zinc-700',
			'hover:bg-zinc-100 dark:hover:bg-zinc-900/50',
			'hover:border-zinc-400 dark:hover:border-zinc-600',
			'active:scale-95',
			'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500',
			'disabled:opacity-40 disabled:cursor-not-allowed',
			'text-zinc-900 dark:text-white',
		]"
	>
		<slot />
	</button>
</template>
