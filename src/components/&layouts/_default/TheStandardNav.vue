<script setup lang="ts">
import { useNav } from './useNav'

const { t } = useI18n()
const router = useRouter()
const { navigableRoutes } = useNav()
</script>

<template>
  <div _flex="~ col" _gap4>
    <div
      v-for="{ path, meta: { icon, title } } in navigableRoutes"
      :key="path"
      @click="router.push(path)"
    >
      <div :class="`icon-${icon}`" :title="t(title)" />
    </div>
  </div>
</template>
