<script setup lang="ts">
import ThePageHeader from './ThePageHeader.vue';

import type { LocaleKey } from '~/types/i18n';

const { header, navItems } = defineProps<{
  header: string;
  navItems: { title: LocaleKey; path: string }[];
}>();

const { t } = useI18n();
const router = useRouter();
</script>

<template>
  <div>
    <ThePageHeader>{{ header }}</ThePageHeader>

    <div
      _flex="~ col md:row md:wrap"
      _items-center
      _justify-center
      _gap="5 md:6 xl:8"
      _px="6 md:8 xl:10"
    >
      <BaseFadeTransitionGroup>
        <div
          v-for="{ title, path } in navItems"
          :key="path"
          _w="full md:40 lg:44 2xl:48"
          _h="auto md:28 lg:32 2xl:36"
          _p2
          _rounded
          _bg-accent-alt-interactive
          _text-accent-alt-interactive-contrast
          _border="1 accent"
          _transition-all
          _cursor-pointer
          @click="router.push(path)"
        >
          <div _h-full _flex _items-center _justify-center>
            <div _text="center lg">
              {{ t(title) }}
            </div>
          </div>
        </div>
      </BaseFadeTransitionGroup>
    </div>
  </div>
</template>
