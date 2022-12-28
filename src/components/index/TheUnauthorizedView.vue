<script setup lang="ts">
import logoImg from '~/assets/img/logo.png';

const { t } = useI18n();
const router = useRouter();
</script>

<template>
  <div
    _flex="~ col"
    _items-center
    _p="t8 x3"
    _bg-accent
    _text-accent-contrast
    _h-full
    _gap2
  >
    <div _text-3xl>{{ t('title') }}</div>

    <div _text-center _px4>{{ t('index.description') }}</div>

    <div />

    <div
      _w="[min(100%,52vh,26rem)]"
      _pb="[min(100%,52vh,26rem)]"
      _rounded-full
      _relative
    >
      <div _cover :style="{ backgroundImage: `url(${logoImg})` }" _bg-cover />
    </div>

    <div _h6 />

    <BaseButton alt _w="full sm:auto" @click="router.push('/register')">
      {{ t('register.title') }}
    </BaseButton>

    <div>
      {{ t('index.has_account') }}
      <BaseLink to="/login" alt>{{ t('login.title') }}</BaseLink>
    </div>
  </div>
</template>
