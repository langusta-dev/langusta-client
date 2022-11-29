import type {
  RouteMeta,
  RouteRecordNormalized,
  RouteRecordRaw,
} from 'vue-router';
import type { LocaleKey } from '~/types/i18n';

interface NavigableRouteRecordMeta extends RouteMeta {
  nav: true;
  navOrder: number;
  navIcon: string;
  title: LocaleKey;
}

interface NavigableRouteRecordNormalized extends RouteRecordNormalized {
  meta: NavigableRouteRecordMeta;
}

type NavigableRouteRecordRaw = RouteRecordRaw & {
  meta: NavigableRouteRecordMeta;
};

type NavigableRouteRecord =
  | NavigableRouteRecordNormalized
  | NavigableRouteRecordRaw;

type NavigableRoutes = (NavigableRouteRecordNormalized & {
  children: NavigableRouteRecordRaw[];
})[];

// @ts-expect-error TS is stupid
const isNavigableRouteRecord: {
  (route: RouteRecordNormalized): route is NavigableRouteRecordNormalized;
  (route: RouteRecordRaw): route is NavigableRouteRecordRaw;
} = (route) =>
  !!(
    route.meta?.title &&
    route.meta.nav &&
    isNum(route.meta.navOrder) &&
    route.meta.navIcon
  );

const routeSortCompareCb = (a: NavigableRouteRecord, b: NavigableRouteRecord) =>
  a.meta.navOrder - b.meta.navOrder;

export const useNav = () => {
  const router = useRouter();
  const route = useRoute();

  const navigableRoutes = $computed<NavigableRoutes>(() =>
    klona(router.getRoutes())
      .filter<NavigableRouteRecordNormalized>(isNavigableRouteRecord)
      .sort(routeSortCompareCb)
      .map(({ children, ...route }) => ({
        ...route,
        children: children
          .filter(isNavigableRouteRecord)
          .sort(routeSortCompareCb),
      }))
  );

  const _navigableRouteRecordsToSearch = $computed(() => [
    ...navigableRoutes,
    ...navigableRoutes.flatMap(({ children }) => children),
  ]);

  const currentNavigableRoute = $computed<NavigableRouteRecord | null>(
    () =>
      _navigableRouteRecordsToSearch.find(({ path }) => path === route.path) ||
      null
  );

  return $$({ navigableRoutes, currentNavigableRoute });
};
