<script setup>
const head = useLocaleHead({
  lang: true,
  dir: true,
});
</script>

<template>
  <div>
    <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">
      <Head>
        <Title>{{ $t("title", { name: "Gravitalia" }) }}</Title>
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
        <LayoutNavbar />
        <slot />
      </Body>
    </Html>
  </div>
</template>
