<script setup lang="ts">
import { isMobile } from '~/composables/mobile'

const router = useRouter()

const navComponent = computed(() =>
  isMobile.value
    ? defineAsyncComponent(() => import('./the-nav/TheMobileNav.vue'))
    : defineAsyncComponent(() => import('./the-nav/TheStandardNav.vue'))
)
</script>

<template>
  <component :is="navComponent" />
</template>
