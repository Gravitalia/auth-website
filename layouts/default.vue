<script setup>
const route = useRoute();
const { t } = useI18n();
const head = useLocaleHead();
const title = computed(() =>
	route.meta.title ? t(route.meta.title) : t("title", { name: "Gravitalia" }),
);
</script>

<template>
  <div>
    <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">
      <Head>
        <Title>{{ title }}</Title>
        <template v-for="link in head.link" :key="link.id">
          <Link
            :id="link.id"
            :rel="link.rel"
            :href="link.href"
            :hreflang="link.hreflang"
          />
        </template>
        <Meta name="og:description" :content="$t('description')" />
        <Meta name="description" :content="$t('description')" />
        <template v-for="meta in head.meta" :key="meta.id">
          <Meta
            :id="meta.id"
            :property="meta.property"
            :content="meta.property"
          />
        </template>
      </Head>
      <Body>
        <slot />
      </Body>
    </Html>
  </div>
</template>
