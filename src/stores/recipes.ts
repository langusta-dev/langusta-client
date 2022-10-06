import { acceptHMRUpdate, defineStore } from 'pinia'

import { fetchRecipes } from '~/api/recipes'

import type { Recipe } from '~/types/recipes'

export const useRecipesStore = defineStore('recipes', () => {
  const recipes = $(useAsyncState<Recipe[]>(fetchRecipes, []))

  return $$({ recipes: computed(() => recipes) })
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRecipesStore, import.meta.hot))
}
