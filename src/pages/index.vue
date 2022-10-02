<route lang="yaml">
meta:
  layout: home
</route>

<script setup lang="ts">
import TheTree from '~/components/&shared/TheTree.vue'

import { useNamesStore } from '~/stores/names'

const { currentName } = useNamesStore()
const router = useRouter()

const name = $ref('')

const pushNameRoute = () => {
  if (name) {
    router.push(`/hi/${encodeURIComponent(name)}`)
  }
}

const { t } = useI18n()

const inputPlaceholder = $computed(() =>
  currentName
    ? t('home.input_placeholder_with_name', { name: currentName })
    : t('home.input_placeholder')
)
</script>

<template>
  <div>
    <TheTree _inline-block _text-5xl _mb-1 />

    <div>
      <BaseLink to="https://github.com/brofrain/vitestrict" external>
        ViteStrict
      </BaseLink>
      <p>
        <em>
          {{ t('home.description') }}
        </em>
      </p>
    </div>

    <div _py-3 />

    <div>
      <BaseInput
        v-model="name"
        :placeholder="inputPlaceholder"
        @keydown.enter="pushNameRoute()"
      />
    </div>

    <div>
      <BaseButton :disabled="!name" _m-3 @click="pushNameRoute()">
        {{ t('home.button') }}
      </BaseButton>
    </div>
  </div>
</template>
