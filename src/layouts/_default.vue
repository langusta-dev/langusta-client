<script setup lang="ts">
import TheMobileNav from '~/components/&layouts/_default/TheMobileNav.vue';
import TheStandardNav from '~/components/&layouts/_default/TheStandardNav.vue';

import { useWindowWidthBreakpoints } from '~/composables/window';

const { isMd } = useWindowWidthBreakpoints();
</script>

<template>
  <div _flex="~ col md:row">
    <main _grow>
      <BaseRouterView />
    </main>

    <BaseFadeTransition>
      <TheStandardNav v-if="isMd" _order-first />
      <TheMobileNav v-else />
    </BaseFadeTransition>
  </div>
</template>
