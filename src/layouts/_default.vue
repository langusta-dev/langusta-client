<script setup lang="ts">
import TheMobileNav from '~/components/&layouts/_default/TheMobileNav.vue'
import TheStandardNav from '~/components/&layouts/_default/TheStandardNav.vue'

const route = useRoute()
</script>

<template>
  <div _h-full _flex="~ col md:row">
    <main _grow _p="x4">
      <RouterView v-slot="{ Component }">
        <BaseFadeTransition appear>
          <component :is="Component" :key="route.name" />
        </BaseFadeTransition>
      </RouterView>
    </main>

    <div _order-first _hidden _md:block>
      <TheStandardNav />
    </div>
    <div _md:hidden>
      <TheMobileNav />
    </div>
  </div>
</template>
