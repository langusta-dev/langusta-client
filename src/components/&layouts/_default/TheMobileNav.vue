<script setup lang="ts">
import { useNav } from '~/composables/useNav';

const { t } = useI18n();
const router = useRouter();
const { navigableRootRoutes, neighboringNavigableRoutes, isActiveRoutePath } =
  $(useNav());

const STATIC_NAV_BTN_CLASSES = [
  'flex-center',
  'rounded-full',
  'cursor-pointer',
  'transition-colors',
  'bg-primary !hover:bg-accent group-hover:bg-accent',
];

const composeBtnClasses = (path: string) => [
  ...STATIC_NAV_BTN_CLASSES,
  isActiveRoutePath(path) ? '!bg-accent' : null,
];

type NavIcon = string | string[];

const parseNeighboringNavIcon = (navIcon: NavIcon) =>
  isStr(navIcon) ? [navIcon] : navIcon;

const parseRootNavIcon = (navIcon: NavIcon) =>
  isStr(navIcon) ? navIcon : navIcon[0];
</script>

<template>
  <div _flex="~ col" _bg="primary-contrast/30" _select-none>
    <BaseFadeTransition>
      <div
        v-if="neighboringNavigableRoutes"
        _flex
        _justify-center
        _gap4
        _py1
        _bg="primary/30"
      >
        <div
          v-for="{
            path,
            meta: { title, navIcon },
          } in neighboringNavigableRoutes"
          :key="path"
          :title="t(title)"
          :class="composeBtnClasses(path)"
          _h10
          _w10
          @click="router.push(path)"
        >
          <BaseIconGroup :icons="parseNeighboringNavIcon(navIcon)" />
        </div>
      </div>
    </BaseFadeTransition>

    <div _flex _justify-center _pt1>
      <div
        v-for="{ path, meta: { navIcon, title } } in navigableRootRoutes"
        :key="path"
        _grow
        _basis-0
        _flex
        _justify-center
      >
        <div
          class="group"
          _flex="~ col"
          _items-center
          _gap=".2"
          _cursor-pointer
          @click="router.push(path)"
        >
          <div :class="composeBtnClasses(path)" _h9 _w9>
            <div _text-lg>
              <div :class="`icon-${parseRootNavIcon(navIcon)}`" _text-lg />
            </div>
          </div>

          <div _text-xs>
            {{ t(title) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
