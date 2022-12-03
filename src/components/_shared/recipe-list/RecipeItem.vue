<script setup lang="ts">
import { useRecipeStore } from '~/stores/recipe';

import type { Recipe } from '~/types/recipe';

const { recipe } = defineProps<{ recipe: Recipe }>();

const recipeStore = useRecipeStore();

const isEditable = $computed(() => recipeStore.isRecipeOwnedById(recipe.id));
</script>

<template>
  <div _w40 _h-60>
    <div>
      {{ recipe.title }}
    </div>
    <div>
      {{ isEditable }}
    </div>
  </div>
</template>
