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

  const _navigableRoutes = $computed<NavigableRouteRecordNormalized[]>(() =>
    router.getRoutes().filter(isNavigableRouteRecord).sort(routeSortCompareCb)
  );

  const _navigableRoutePerPath = $computed(
    () =>
      new Map(
        _navigableRoutes.map((navigableRoute) => [
          navigableRoute.path,
          navigableRoute,
        ])
      )
  );

  const getNavigableRouteByPath = (path: string) =>
    _navigableRoutePerPath.get(path) as NavigableRouteRecordNormalized;

  const subroutePathsPerRootPaths = $computed(() => {
    const subRoutePathsPerRootPaths = new SafeMap<string, string[]>({
      defaultSetter: () => [],
    });

    for (const navigableRoute of _navigableRoutes) {
      const parentRoute = _navigableRoutes.find(
        ({ path }) =>
          path !== '/' &&
          path.length < navigableRoute.path.length &&
          navigableRoute.path.includes(path)
      );

      if (parentRoute) {
        subRoutePathsPerRootPaths
          .get(parentRoute.path)
          .push(navigableRoute.path);
      }
    }

    return subRoutePathsPerRootPaths;
  });

  const navigableRootRoutes = $computed(() => {
    const subroutePaths = new Set(
      [...subroutePathsPerRootPaths.values()].flat()
    );

    return _navigableRoutes.filter(({ path }) => !subroutePaths.has(path));
  });

  const _currentNavigableRoute =
    $computed<NavigableRouteRecordNormalized | null>(
      () => _navigableRoutes.find(({ path }) => path === route.path) || null
    );

  const navigableSubRoutes = $computed<NavigableRouteRecordNormalized[] | null>(
    () => {
      if (!_currentNavigableRoute) {
        return null;
      }

      return subroutePathsPerRootPaths
        .get(_currentNavigableRoute.path)
        .map(getNavigableRouteByPath);
    }
  );

  const neighboringNavigableRoutes = $computed<
    NavigableRouteRecordNormalized[] | null
  >(() => {
    const neighboringPathMatch = route.path.match(/^\/[a-z-]+\//);

    if (!neighboringPathMatch) {
      return null;
    }

    const neighboringPathPrefix = neighboringPathMatch[0];

    return _navigableRoutes.filter(({ path }) =>
      path.startsWith(neighboringPathPrefix)
    );
  });

  const isActiveRoutePath = (path: string) =>
    !!(
      _currentNavigableRoute &&
      (path === _currentNavigableRoute.path ||
        (path !== '/' && _currentNavigableRoute.path.includes(path)))
    );

  return $$({
    navigableRootRoutes,
    navigableSubRoutes,
    neighboringNavigableRoutes,
    isActiveRoutePath,
  });
};
