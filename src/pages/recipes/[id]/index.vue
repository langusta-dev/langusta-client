<script setup lang="ts">
import { useRecipeStore } from '~/stores/recipe';

import { fetchRecipesByIds } from '~/api/recipe';

import type { Uuid } from '~/types/uuid';

const { id } = defineProps<{ id: Uuid }>();

const router = useRouter();
const recipeStore = useRecipeStore();

const isRecipeLoading = $ref(false);

const recipe = $(
  computedAsync(
    async () => {
      const recipe = recipeStore.getRecipeById(id);

      if (recipe) {
        return recipe;
      }

      const recipes = await fetchRecipesByIds([id]);

      if (recipes?.length === 1) {
        return recipes[0];
      }

      return null;
    },
    null,
    $$(isRecipeLoading)
  )
);

whenever(
  () => !isRecipeLoading && !recipe,
  () => {
    router.replace({ name: 'all', params: { all: ['recipes', id] } });
  }
);
</script>

<template>
  <BaseFadeTransition>
    <div v-if="recipe" _flex="~ col" _items-center _gap4 _p="t4 x4">
      <div _text-lg>{{ recipe.title }}</div>

      <div
        v-if="recipe.imgPath"
        _w-full
        _h50
        _rounded
        :style="{ backgroundImage: `url(${recipe.imgPath})` }"
        _bg="cover center no-repeat"
      />
    </div>
  </BaseFadeTransition>
</template>
