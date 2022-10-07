<script setup lang="ts">
import { useNav } from './useNav'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { navigableRoutes } = useNav()
</script>

<template>
  <div _h-full _flex="~ col" _gap1 _bg="primary-contrast/30" _p="t4 x1">
    <div
      v-for="{ path, meta: { icon, title } } in navigableRoutes"
      :key="path"
      _flex
      _gap2
      _items-center
      _p="l2 r4 y1"
      _rounded
      _relative
      _cursor-pointer
      _bg="#fff/60 hover:accent"
      _text="#222 hover:accent-contrast"
      _transition-all
      @click="router.push(path)"
    >
      <div :class="`icon-${icon}`" _text-lg />
      <div>
        {{ t(title) }}
      </div>

      <BaseFadeTransition>
        <div
          v-if="route.path === path"
          _cover
          _pointer-events-none
          _border="2 accent"
        />
      </BaseFadeTransition>
    </div>
  </div>
</template>
