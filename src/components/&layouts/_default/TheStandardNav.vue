<script setup lang="ts">
import { useNav } from './useNav';

const { t } = useI18n();
const router = useRouter();
const {
  navigableRootRoutes,
  isActiveRoutePath,
  hasNavigableSubRoutesByRootPath,
  getNavigableSubRoutesByRootPath,
} = useNav();
</script>

<template>
  <div _h-full _flex="~ col" _gap4 _bg="primary-contrast/30" _p="t4 x1">
    <div
      v-for="{ path, meta: { navIcon, title } } in navigableRootRoutes"
      :key="path"
    >
      <div
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
        <div :class="`icon-${navIcon}`" _text-lg />
        <div>
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

      <div
        v-if="hasNavigableSubRoutesByRootPath(path)"
        _flex="~ col"
        _gap1
        _p="y1 x2"
      >
        <div
          v-for="{
            path: subPath,
            meta: { title: subTitle },
          } in getNavigableSubRoutesByRootPath(path)"
          :key="subPath"
          _flex
          _justify-center
          _cursor-pointer
          @click="router.push(subPath)"
        >
          <div _text="center hover:accent" _transition-all _relative>
            {{ t(subTitle) }}

            <BaseFadeTransition>
              <div
                v-if="isActiveRoutePath(subPath)"
                _cover
                _pointer-events-none
                _border="b-1 accent"
              />
            </BaseFadeTransition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
