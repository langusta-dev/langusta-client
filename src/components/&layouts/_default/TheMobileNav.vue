<script setup lang="ts">
import { useNav } from './useNav'

const { t } = useI18n()
const router = useRouter()
const { navigableRoutes } = useNav()
</script>

<template>
  <div _flex _justify-center _gap4>
    <div
      v-for="{ path, meta: { icon, title } } in navigableRoutes"
      :key="path"
      _flex
      @click="router.push(path)"
    >
      <div :class="`icon-${icon}`" />
      <div>
        {{ t(title) }}
      </div>
    </div>
  </div>
</template>
