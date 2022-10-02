<script setup lang="ts">
import { toggleDark } from '~/composables/dark'

const { t, availableLocales: locales, locale } = useI18n()

const toggleLocales = () => {
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}
</script>

<template>
  <nav _flex _justify-center _gap-3 _text-xl _my-4>
    <BaseLink to="/" :title="t('nav.link_home')">
      <div _icon-carbon-tree />
    </BaseLink>

    <BaseLink
      to="https://github.com/antfu/vitesse"
      external
      :title="t('nav.link_vitesse')"
    >
      <div _icon-carbon-campsite />
    </BaseLink>

    <BaseLink :title="t('nav.toggle_dark')" @click="toggleDark()">
      <div _icon="carbon-sun dark:carbon-moon" />
    </BaseLink>

    <BaseLink :title="t('nav.toggle_langs')" @click="toggleLocales()">
      <div _icon-carbon-language />
    </BaseLink>

    <BaseLink to="/about" :title="t('nav.link_about')">
      <div _icon-carbon-dicom-overlay />
    </BaseLink>

    <BaseLink
      to="https://github.com/brofrain/vitestrict"
      external
      title="GitHub"
    >
      <div _icon-carbon-logo-github />
    </BaseLink>
  </nav>
</template>
