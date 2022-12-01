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

  const navigableRoutePerPath = computed(() =>
    Object.fromEntries(
      navigableRoutes.map((navigableRoute) => [
        navigableRoute.path,
        navigableRoute,
      ])
    )
  );

  const subRoutePathsPerRootPaths = computed(() => {
    const subRoutePathsPerRootPaths = new SafeMap<string, string[]>({
      defaultSetter: () => [],
    });

    for (const navigableRoute of navigableRoutes) {
      const parentRoute = navigableRoutes.find(({ path }) =>
        navigableRoute.path.includes(path)
      );

      if (parentRoute) {
        if (!subRoutePathsPerRootPaths.has(parentRoute.path)) {
          subRoutePathsPerRootPaths.set(parentRoute.path, []);
        }

        subRoutePathsPerRootPaths
          .get(parentRoute.path)
          .push(navigableRoute.path);
      }
    }

    return subRoutePathsPerRootPaths;
  });

  const currentNavigableRoute =
    $computed<NavigableRouteRecordNormalized | null>(
      () => navigableRoutes.find(({ path }) => path === route.path) || null
    );

  const navigableNeighboringRoutes = $computed<
    NavigableRouteRecordNormalized[] | null
  >(() => {
    if (!currentNavigableRoute) {
      return null;
    }

    const neighboringPathMatch = currentNavigableRoute.path.match(/$\/[a-z]+-/);

    if (!neighboringPathMatch) {
      return null;
    }

    const neighboringPathPrefix = neighboringPathMatch[0];

    return navigableRoutes.filter(({ path }) =>
      path.startsWith(neighboringPathPrefix)
    );
  });

  return $$({
    navigableRoutes,
    currentNavigableRoute,
    navigableNeighboringRoutes,
  });
};
