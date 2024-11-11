import { isDevelopment } from "std-env";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",

  devtools: { enabled: true },

  modules: [
    "@nuxt/eslint",
    "@unocss/nuxt",
    "@nuxtjs/i18n",
    [
      "@nuxtjs/color-mode",
      {
        preference: "system",
        classPrefix: "",
        classSuffix: "",
      },
    ],
    ...isDevelopment ? [] : ["nuxt-security"],
    "@nuxt/image",
  ],
  css: [],
  ssr: true,
  components: true,
  sourcemap: isDevelopment,

  i18n: {
    defaultLocale: "en",
    strategy: "no_prefix",
    lazy: false,
    langDir: "locales",
    compilation: {
      strictMessage: false,
      escapeHtml: true,
    },
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
      title: "Gravitalia Account",
      htmlAttrs: {
        lang: "en",
      },
      link: [
        { rel: "icon", href: "/favicon.ico", sizes: "any" },
        { rel: "icon", type: "image/webp", href: "/favicon.webp" },
        { rel: "apple-touch-icon", href: "/favicon.png" },
      ],
      meta: [
        { name: "apple-mobile-web-app-status-bar-style", content: "default" },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Gravitalia Account" },
        { property: "og:title", content: "Gravitalia Account" },
        { property: "og:image", content: "/favicon.webp" },
        { property: "og:site_name", content: "Gravitalia Account" },
        { name: "twitter:site", content: "@gravitalianews" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    },
  },

  security: {
    headers: {
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        "default-src": ["\'self\'"],
        "base-uri": ["\'self\'"],
        "connect-src": ["\'self\'", "https:"],
        "font-src": ["\'self\'"],
        "form-action": ["\'none\'"],
        "frame-ancestors": ["\'none\'"],
        "frame-src": ["https:"],
        "img-src": ["\'self\'", "https:", "data:", "blob:"],
        "manifest-src": ["\'self\'"],
        "media-src": ["\'self\'", "https:"],
        "object-src": ["\'none\'"],
        "script-src": ["\'self\'", "\'unsafe-inline\'"],
        "script-src-attr": ["\'none\'"],
        "style-src": ["\'self\'", "\'unsafe-inline\'"],
        "upgrade-insecure-requests": true,
      },
      permissionsPolicy: {
        fullscreen: "*",
      },
    },
    rateLimiter: false,
  },
  routeRules: {
    // Static generation
    /*"/signin": { prerender: true },
    "/signup": { prerender: true },
    // No JS.
    "/terms": { experimentalNoScripts: true },
    "/privacy": { experimentalNoScripts: true },*/
  },
});