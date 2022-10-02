<script setup lang="ts">
const cookiesAccepted = useLocalStorage('cookies-accepted', false)

const { t } = useI18n()
</script>

<template>
  <BaseFadeTransition appear>
    <div
      v-if="!cookiesAccepted"
      _absolute
      _top-0
      _inset-x-0
      _h-6
      _leading-6
      _bg-accent
      _text-accent-contrast
      _text-center
      _select-none
    >
      {{ t('cookie_bar.hi') }}!
      <span _underline _cursor-pointer @click="cookiesAccepted = true">
        {{ t('cookie_bar.accept') }}
      </span>
      {{ t('cookie_bar.cookies') }}
    </div>
  </BaseFadeTransition>
</template>
