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
    "@nuxt/image", ...isDevelopment ? [] : ["nuxt-security"],
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
  ],
  ssr: false, // could be set to true.
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
      defaultServer: isDevelopment ? "localhost:3000" : "localhost:8787",
    },
  },

  nitro: {
    preset: isDevelopment ? "node-server" : "cloudflare_module",
    prerender: {
      autoSubfolderIndex: !isDevelopment,
    },
  },

  sri: true,
  security: {
    headers: {
      crossOriginEmbedderPolicy: "credentialless",
      crossOriginOpenerPolicy: "same-origin",
      crossOriginResourcePolicy: "same-site",
      originAgentCluster: "?1",
      referrerPolicy: "no-referrer",
      strictTransportSecurity: {
        maxAge: 63072000, // 2 years
        includeSubdomains: true,
        preload: true,
      },
      xFrameOptions: false, // managed by CSP.
      contentSecurityPolicy: {
        "default-src": ["'self'"],
        "form-action": ["'none'"],
        "frame-ancestors": ["'none'"],
        "frame-src": ["'none'"],
        "script-src-attr": ["'none'"],
        "object-src": ["'none'"],
        "connect-src": ["'self'", "https:", "localhost:*"],
        "img-src": ["'self'", "https:", "data:", "blob:"],
        "media-src": ["'self'", "https:"],
        "script-src": ["'self'", "'unsafe-inline'", "'strict-dynamic'", "'nonce-{{nonce}}'"],
        "style-src": ["'self'", "'unsafe-inline'"], // remove 'unsafe-inline' if tailwind not inline.
        "upgrade-insecure-requests": false,
      },
      permissionsPolicy: {
        camera: [],
        geolocation: [],
        microphone: [],
      },
    },
    corsHandler: {
      origin: "*",
      methods: "OPTIONS, GET",
      allowHeaders: "Authorization, Content-Type, Accept",
      credentials: true,
      maxAge: "86400",
      preflight: {
        statusCode: 200,
      },
    },
    allowedMethodsRestricter: {
      methods: ["OPTIONS", "GET"],
    },
    rateLimiter: false,
  },
});
