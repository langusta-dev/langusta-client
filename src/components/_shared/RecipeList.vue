<script setup lang="ts">
import RecipeItem from './recipe-list/RecipeItem.vue';
import TheUtilityBar from './recipe-list/TheUtilityBar.vue';

import type { Recipe } from '~/types/recipe';
import type { Uuid } from '~/types/uuid';

const { recipes } = defineProps<{ recipes: Recipe[] }>();

const search = $ref('');

const trimmedSearch = $computed(() => search.replace(/\s/g, ''));

const foundSearchIndexPerRecipeId = $computed(
  () =>
    new SafeMap<Uuid, number>(
      recipes.map(
        ({ id, title, description, steps, calorieCount, ingredients }) => [
          id,
          (() =>
            [
              title,
              description,
              steps ? steps.map(({ description }) => description).join('') : '',
              calorieCount,
              ingredients.map(({ name, quantity, quantityUnit }) =>
                [name, quantity, quantityUnit].join('')
              ),
            ]
              .join('')
              .indexOf(trimmedSearch))(),
        ]
      ),
      { defaultSetter: () => -1 }
    )
);

const recipesToDisplay = $computed(() => {
  if (!trimmedSearch) {
    return recipes;
  }

  return recipes
    .filter(({ id }) => foundSearchIndexPerRecipeId.get(id) !== -1)
    .sort(
      (a, b) =>
        foundSearchIndexPerRecipeId.get(b.id) -
        foundSearchIndexPerRecipeId.get(a.id)
    );
});
</script>

<template>
  <div>
    <TheUtilityBar v-model:search="search" />

    <div _flex="~ wrap">
      <RecipeItem
        v-for="recipe in recipesToDisplay"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>
  </div>
</template>
