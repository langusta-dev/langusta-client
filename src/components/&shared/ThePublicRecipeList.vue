<script setup lang="ts">
import TheRecipeList from '~/components/&shared/TheRecipeList.vue';

import { fetchPublicRecipes } from '~/api/recipe';

import type { PublishedRecipe } from '~/types/recipe';
import type { Uuid } from '~/types/uuid';

const props = defineProps<{
  selectedRecipeIds?: Set<Uuid> | null;
  search?: string;
}>();

const emit = defineEmits<{
  (e: 'update:search', v: string): void;
  (e: 'update:selectedRecipeIds', v: Set<Uuid>): void;
}>();

let _search = $ref('');
const search = $computed({
  get: () => props.search || _search,
  set: (v) => {
    _search = v;
    emit('update:search', v);
  },
});

const selectedRecipeIds = $computed({
  get: () => props.selectedRecipeIds || null,
  set: (v) => {
    if (v) {
      emit('update:selectedRecipeIds', v);
    }
  },
});

const recipes = $ref<PublishedRecipe[]>([]);

const recipeIds = $computed(() => new Set(recipes.map(({ id }) => id)));

watchDebounced(
  $$(search),
  async () => {
    const newRecipes = await fetchPublicRecipes(search ? { search } : {});

    if (newRecipes) {
      recipes.push(...newRecipes.filter(({ id }) => !recipeIds.has(id)));
    }
  },
  { immediate: true, debounce: 500, maxWait: 1000 }
);
</script>

<template>
  <TheRecipeList
    v-model:selected-recipe-ids="selectedRecipeIds"
    v-model:search="search"
    :recipes="recipes"
  />
</template>
