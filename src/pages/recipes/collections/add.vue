<route lang="yaml">
meta:
  auth: true
  title: recipe_collections.add_recipe_collection
</route>

<script setup lang="ts">
import ThePageHeader from '~/components/&shared/ThePageHeader.vue';
import TheRecipeCollectionForm from '~/components/recipes-collections/&shared/TheRecipeCollectionForm.vue';

import { useRecipeCollectionStore } from '~/stores/recipeCollection';

import type { EditableRecipeCollection } from '~/types/recipeCollection';

const { t } = useI18n();
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
  <div>
    <ThePageHeader>
      {{ t('recipe_collections.add_recipe_collection') }}
    </ThePageHeader>
    <TheRecipeCollectionForm
      v-model:recipe-collection="newRecipeCollection"
      @submit-recipe-collection="submitRecipeCollection()"
    />
  </div>
</template>
