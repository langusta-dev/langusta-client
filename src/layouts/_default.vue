<script setup lang="ts">
import TheMobileNav from '~/components/&layouts/_default/TheMobileNav.vue';
import TheStandardNav from '~/components/&layouts/_default/TheStandardNav.vue';
</script>

<template>
  <div _flex="~ col md:row">
    <main _grow _p="x4">
      <BaseRouterView />
    </main>

    <div _order-first _hidden _md:block>
      <TheStandardNav />
    </div>
    <div _md:hidden>
      <TheMobileNav />
    </div>
  </div>
</template>
