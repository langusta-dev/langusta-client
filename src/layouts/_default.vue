<script setup lang="ts">
import TheMobileNav from '~/components/&layouts/_default/TheMobileNav.vue';
import TheStandardNav from '~/components/&layouts/_default/TheStandardNav.vue';

import { useWindowWidthBreakpoints } from '~/composables/window';

const { isMd } = $(useWindowWidthBreakpoints());

const flexDirection = $computed(() => (isMd ? 'flex-row' : 'flex-col'));
</script>

<template>
  <div _h-full _flex :class="flexDirection">
    <main _grow>
      <BaseScroll>
        <BaseRouterView />
      </BaseScroll>
    </main>

    <TheStandardNav v-if="isMd" _order-first />
    <TheMobileNav v-else />
  </div>
</template>
