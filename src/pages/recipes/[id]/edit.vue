<route lang="yaml">
meta:
  auth: true
  title: recipes.edit_recipe
</route>

<script setup lang="ts">
import ThePageHeader from '~/components/&shared/ThePageHeader.vue';
import TheRecipeForm from '~/components/recipes/&shared/TheRecipeForm.vue';

import { useRecipeStore } from '~/stores/recipe';

import type { Uuid } from '~/types/uuid';

const { id } = defineProps<{ id: Uuid }>();

const { t } = useI18n();
const router = useRouter();
const recipeStore = useRecipeStore();

const recipe = $computed(() => recipeStore.getRecipeById(id));

if (!recipe?.isOwned) {
  router.replace({ name: 'all', params: { all: ['recipes', id, 'edit'] } });
}

const editableRecipe = $ref(recipe ? klona(recipe) : null);

const submitRecipe = async () => {
  if (!editableRecipe) {
    return;
  }

  await recipeStore.editRecipeById(id, editableRecipe);
  router.push('/recipes/created-by-me');
};
</script>

<template>
  <div>
    <ThePageHeader>{{ t('recipes.edit_recipe') }}</ThePageHeader>
    <TheRecipeForm
      v-if="editableRecipe"
      v-model:recipe="editableRecipe"
      @submit-recipe="submitRecipe()"
    />
  </div>
</template>
