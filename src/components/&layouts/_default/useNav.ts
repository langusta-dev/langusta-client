import type { NavigableRoute } from '~/types/nav'

export const useNav = () => {
  const router = useRouter()

  const navigableRoutes = computed<NavigableRoute[]>(() =>
    router
      .getRoutes()
      .filter(
        (route): route is NavigableRoute =>
          !!(
            route.meta.nav &&
            isNum(route.meta.navOrder) &&
            route.meta.title &&
            route.meta.icon
          )
      )
      .sort((a, b) => a.meta.navOrder - b.meta.navOrder)
  )

  return { navigableRoutes }
}
