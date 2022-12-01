<script setup lang="ts">
import { useNav } from './useNav';

const { t } = useI18n();
const router = useRouter();
const { navigableRoutes, currentNavigableRoute, navigableNeighboringRoutes } =
  useNav();
</script>

<template>
  <div _flex="~ col">
    <BaseFadeTransition>
      <div v-if="navigableNeighboringRoutes" _flex>
        <div
          v-for="{ path, meta: { title } } in navigableNeighboringRoutes"
          :key="path"
          _grow
        >
          {{ title }}
        </div>
      </div>
    </BaseFadeTransition>

    <div _flex _justify-center _gap1 _bg="primary-contrast/30" _p="t1 x1">
      <div
        v-for="{ path, meta: { navIcon, title } } in navigableRoutes"
        :key="path"
        _grow
      >
        <div
          _flex="~ col"
          _items-center
          _gap="[0.1rem]"
          _rounded
          _p="t2"
          _relative
          _cursor-pointer
          _bg="#fff/60 hover:accent"
          _text="#222 hover:accent-contrast"
          _transition-all
          @click="router.push(path)"
        >
          <div :class="`icon-${navIcon}`" />
          <div _text-sm>
            {{ t(title) }}
          </div>

          <BaseFadeTransition>
            <div
              v-if="currentNavigableRoute?.path === path"
              _cover
              _pointer-events-none
              _border="2 accent"
            />
          </BaseFadeTransition>
        </div>
      </div>
    </div>
  </div>
</template>
