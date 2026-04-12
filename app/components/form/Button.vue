<template>
	<button
		type="button"
		tabindex="0"
		class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ease-out"
		:class="[
			'bg-white/80 dark:bg-zinc-900/80',
			'border border-zinc-300 dark:border-zinc-700',
			'hover:bg-white/90 dark:hover:bg-zinc-800/90',
			'hover:border-zinc-400 dark:hover:border-zinc-600',
			'active:scale-95',
			'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500',
			'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/80 dark:disabled:hover:bg-zinc-900/80',
			'text-zinc-900 dark:text-white shadow-sm',
		]"
	>
		<slot />
	</button>
</template>
