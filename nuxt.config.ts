import { isDevelopment } from "std-env";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  modules: [
    "@nuxt/eslint",
    "@nuxtjs/i18n",
    [
      "@nuxtjs/color-mode",
      {
        preference: "system",
        classPrefix: "",
        classSuffix: "",
      },
    ],
    "@nuxt/image", //...isDevelopment ? [] : ["nuxt-security"],
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
  ],
  ssr: true,
  components: true,
  sourcemap: isDevelopment,

  i18n: {
    defaultLocale: "en",
    strategy: "no_prefix",
    lazy: true,
    langDir: ".",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "locale",
      redirectOn: "root",
      fallbackLocale: "en",
      alwaysRedirect: true,
    },
    locales: [
      {
        code: "en",
        iso: "en-US",
        file: "en-US.json",
        name: "English",
      },
      {
        code: "fr",
        iso: "fr-FR",
        file: "fr-FR.json",
        name: "Français",
      },
    ],
    baseUrl: "https://account.gravitalia.com",
  },

  app: {
    keepalive: true,
    head: {
      charset: "utf-8",
      viewport: "width=device-width,initial-scale=1",
      bodyAttrs: {
        class: "dark:bg-zinc-950 dark:text-white font-sans",
      },
      link: [
        { rel: "icon", type: "image/webp", href: "/favicon.webp" },
        { rel: "apple-touch-icon", href: "/favicon.webp" },
      ],
      meta: [
        {
          property: "apple-mobile-web-app-status-bar-style",
          content: "default",
        },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Gravitalia Account" },
        { property: "og:title", content: "Gravitalia Account" },
        { property: "og:image", content: "/favicon.webp" },
        { property: "twitter:site", content: "@gravitalianews" },
        { property: "twitter:card", content: "summary_large_image" },
      ],
    },
  },

  runtimeConfig: {
    public: {
      defaultServer: isDevelopment ? "localhost:3000" : "https://account.gravitalia.com",
    },
  },

  nitro: {
    preset: isDevelopment ? "" : "cloudflare_module",
    prerender: {
      autoSubfolderIndex: !isDevelopment,
    },
  },

  /*security: {
    headers: {
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        "default-src": ["'self'"],
        "base-uri": ["'self'"],
        "connect-src": ["'self'", "https:"],
        "font-src": ["'self'"],
        "form-action": ["'none'"],
        "frame-ancestors": ["'none'"],
        "frame-src": ["https:"],
        "img-src": ["'self'", "https:", "data:", "blob:"],
        "manifest-src": ["'self'"],
        "media-src": ["'self'", "https:"],
        "object-src": ["'none'"],
        "script-src": ["'self'", "'unsafe-inline'"],
        "script-src-attr": ["'none'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "upgrade-insecure-requests": true,
      },
      permissionsPolicy: {
        fullscreen: "*",
      },
    },
    rateLimiter: false,
  },*/
});
