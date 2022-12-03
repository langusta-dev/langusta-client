<script setup lang="ts">
import { useNav } from './useNav';

const { t } = useI18n();
const router = useRouter();
const { navigableRootRoutes, neighboringNavigableRoutes, isActiveRoutePath } =
  useNav();
</script>

<template>
  <div _flex="~ col" _gap1 _bg="primary-contrast/30" _p="t1 x1" _select-none>
    <BaseFadeTransition>
      <div v-if="neighboringNavigableRoutes" _flex _gap1>
        <div
          v-for="{ path, meta: { title } } in neighboringNavigableRoutes"
          :key="path"
          _grow
          _basis-0
          _rounded
          _relative
          _bg="#fff/60 hover:accent"
          _text="#222 hover:accent-contrast"
          _transition-all
          _cursor-pointer
          @click="router.push(path)"
        >
          <div _h-full _p="x1 y.5" _flex _justify-center _items-center>
            <div _text="center sm">
              {{ t(title) }}
            </div>
          </div>

          <BaseFadeTransition>
            <div
              v-if="isActiveRoutePath(path)"
              _cover
              _pointer-events-none
              _border="2 accent"
            />
          </BaseFadeTransition>
        </div>
      </div>
    </BaseFadeTransition>

    <div _flex _justify-center _gap1>
      <div
        v-for="{ path, meta: { navIcon, title } } in navigableRootRoutes"
        :key="path"
        _grow
        _basis-0
      >
        <div
          _flex="~ col"
          _items-center
          _gap=".5"
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
              v-if="isActiveRoutePath(path)"
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
