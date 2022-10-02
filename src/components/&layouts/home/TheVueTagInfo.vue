<script setup lang="ts">
import { fetchLatestVueTag } from '~/api/rest/releases'

const {
  state: tag,
  isReady,
  isLoading,
} = useAsyncState(fetchLatestVueTag(), null)

const { t } = useI18n()
</script>

<template>
  <div _italic _text-sm _text-center _op70 _mb-2>
    <BaseFadeTransition>
      <p v-if="isReady">
        {{ t('home.vue_tag', { tag }) }}
      </p>
      <p v-else-if="isLoading">
        {{ t('home.vue_tag_loading') }}
      </p>
      <p v-else>
        {{ t('home.vue_tag_error') }}
      </p>
    </BaseFadeTransition>
  </div>
</template>
