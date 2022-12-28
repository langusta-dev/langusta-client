<route lang="yaml">
meta:
  auth: true
  title: recipe_collections.add_recipe_collection
</route>

<script setup lang="ts">
import TheRecipeCollectionForm from '~/components/recipes-collections/&shared/TheRecipeCollectionForm.vue';

import { useRecipeCollectionStore } from '~/stores/recipeCollection';

import type { EditableRecipeCollection } from '~/types/recipeCollection';

const router = useRouter();
const recipeCollectionStore = useRecipeCollectionStore();

const initialRecipeCollection = (): EditableRecipeCollection => ({
  title: '',
  description: '',
  recipeIds: [],
});

let newRecipeCollection = $ref<EditableRecipeCollection>(
  initialRecipeCollection()
);

const submitRecipeCollection = () => {
  recipeCollectionStore.addCollection(newRecipeCollection);
  newRecipeCollection = initialRecipeCollection();
  router.push('/recipes/collections/created-by-me');
};
</script>

<template>
  <TheRecipeCollectionForm
    v-model:recipe-collection="newRecipeCollection"
    @submit-recipe-collection="submitRecipeCollection()"
  />
</template>
