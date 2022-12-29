<route lang="yaml">
meta:
  layout: blank
</route>

<script setup lang="ts">
const { all } = defineProps<{ all: string[] }>();

const router = useRouter();
const { t } = useI18n();
</script>

<template>
  <div _flex="~ col" _items-center _text-center _pt10>
    <div _icon-carbon-warning _text-4xl _inline-block _mb-1 />

    <div _text-lg>
      <span _op75>{{ t('page_not_found') }}:</span>
      {{ `/${all.join('/')}` }}
    </div>

    <div _mt-5>
      <BaseButton @click="router.push('/')">
        {{ t('index.title') }}
      </BaseButton>
    </div>
  </div>
</template>
