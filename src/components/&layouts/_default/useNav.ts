import type { RouteMeta, RouteRecordNormalized } from 'vue-router';
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

const isNavigableRouteRecord = (
  route: RouteRecordNormalized
): route is NavigableRouteRecordNormalized =>
  !!(
    route.meta.title &&
    route.meta.nav &&
    isNum(route.meta.navOrder) &&
    route.meta.navIcon
  );

const routeSortCompareCb = (
  a: NavigableRouteRecordNormalized,
  b: NavigableRouteRecordNormalized
) => a.meta.navOrder - b.meta.navOrder;

export const useNav = () => {
  const router = useRouter();
  const route = useRoute();

  const navigableRoutes = $computed<NavigableRouteRecordNormalized[]>(() =>
    router.getRoutes().filter(isNavigableRouteRecord).sort(routeSortCompareCb)
  );

  const currentNavigableRoute =
    $computed<NavigableRouteRecordNormalized | null>(
      () => navigableRoutes.find(({ path }) => path === route.path) || null
    );

  return $$({ navigableRoutes, currentNavigableRoute });
};
