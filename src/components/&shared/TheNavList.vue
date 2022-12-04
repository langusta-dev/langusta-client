<script setup lang="ts">
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
    <div _text="center 4xl" _m="t10 b6 lg:b8 2xl:b10">{{ header }}</div>

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
          _bg="#fff/60 hover:accent"
          _text="#222 hover:accent-contrast"
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
