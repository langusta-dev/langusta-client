<route lang="yaml">
meta:
  layout: blank
  title: 404
</route>

<script setup lang="ts">
const { all } = defineProps<{ all: string[] }>()

const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <div _text-center>
    <div _icon-carbon-warning _text-4xl _inline-block _mb-1 />

    <div _text-lg>
      <span _op75>{{ t('page_not_found') }}</span>
      {{ `/${all.join('/')}` }}
    </div>

    <div _mt-5>
      <BaseButton @click="router.push('/')">
        {{ t('common.button.home') }}
      </BaseButton>
    </div>
  </div>
</template>
