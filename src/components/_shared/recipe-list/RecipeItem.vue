<script setup lang="ts">
import { useRecipeStore } from '~/stores/recipe';

import type { Recipe } from '~/types/recipe';

const { recipe, editable } = defineProps<{
  recipe: Recipe;
  editable: boolean;
}>();

const recipeStore = useRecipeStore();

const isEditable = $computed(
  () => editable && recipeStore.isRecipeOwnedById(recipe.id)
);
</script>

<template>
  <div
    _w38
    _h50
    _rounded
    _bg="#fff/60 hover:accent"
    _text="#222 hover:accent-contrast"
    _transition-all
    _cursor-pointer
    _select-none
  >
    <div>
      {{ recipe.title }}
    </div>
    <div>
      {{ isEditable }}
    </div>
  </div>
</template>
