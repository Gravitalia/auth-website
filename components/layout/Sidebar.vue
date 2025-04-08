<script lang="ts">
const isSideBarOpened = ref(true);

const menuGroups = [
  {
    name: "",
    path: "",
    icon: "",
  }
];
</script>

<template>
  <button
    class="inline-flex border-none items-center p-2 mt-2 ml-3 text-sm text-zinc-700 rounded sm:hidden hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:focus:ring-zinc-600"
    type="button"
    @click="isSideBarOpened = !isSideBarOpened"
  >
    <span class="sr-only">{{ $t("screen_reader.open_sidebar") }}</span>
    <svg
      class="w-6 h-6"
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clip-rule="evenodd"
        fill-rule="evenodd"
        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
      ></path>
    </svg>
  </button>

  <aside
    :class="isSideBarOpened ? 'transform-none' : '-translate-x-full'"
    class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform sm:translate-x-0"
    aria-label="Sidebar"
  >
    <div class="h-full px-3 py-4 overflow-y-auto bg-zinc-50 dark:bg-dark">
      <div class="space-y-2 font-medium">
        <!-- Logo -->
        <div class="flex mb-4">
          <NuxtImg
            alt="Gravitalia"
            src="/favicon.webp"
            width="35"
            draggable="false"
          />

          <h3 class="ml-12 mt-1.5 absolute">Gravitalia</h3>

          <!-- Close sidebar button -->
          <button
            class="block md:hidden border-none ml-auto mt-1"
            type="button"
            @click="isSideBarOpened = false"
          >
            <svg
              class="rounded flex-shrink-0 w-6 h-5 fill-zinc-500 transition duration-75 dark:fill-zinc-400 group-hover:fill-zinc-900 dark:group-hover:fill-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Links -->
        <NuxtLink
          to="/"
          prefetch
          :class="path === '/' ? 'bg-zinc-100 dark:bg-zinc-700 group' : 'hover:bg-zinc-100 dark:hover:bg-zinc-700 group'"
          class="no-underline flex items-center p-2 text-zinc-900 rounded dark:text-white"
        >
          <svg
            :class="path === '/' ? 'fill-zinc-900 dark:fill-white' : 'group-hover:fill-zinc-900 dark:group-hover:fill-white'"
            class="flex-shrink-0 w-6 h-6 fill-zinc-500 transition duration-75 dark:fill-zinc-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M16 2L21 7V21.0082C21 21.556 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918C3 2.44405 3.44495 2 3.9934 2H16ZM12 11.5C13.3807 11.5 14.5 10.3807 14.5 9C14.5 7.61929 13.3807 6.5 12 6.5C10.6193 6.5 9.5 7.61929 9.5 9C9.5 10.3807 10.6193 11.5 12 11.5ZM7.52746 17H16.4725C16.2238 14.75 14.3163 13 12 13C9.68372 13 7.77619 14.75 7.52746 17Z"
            ></path>
          </svg>
          <span class="ml-3">{{ $t("about.title") }}</span>
        </NuxtLink>
      </div>
    </div>
  </aside>
</template>
