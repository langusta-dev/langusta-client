<route lang="yaml">
meta:
  auth: true
</route>

<script setup lang="ts">
import TheRecipeCollectionForm from '~/components/recipes-collections/&shared/TheRecipeCollectionForm.vue';

import { useRecipeCollectionStore } from '~/stores/recipeCollection';

import type { Uuid } from '~/types/uuid';

const { id } = defineProps<{ id: Uuid }>();

const router = useRouter();
const recipeCollectionStore = useRecipeCollectionStore();

const recipeCollection = $computed(() =>
  recipeCollectionStore.getCollectionById(id)
);

if (!recipeCollection?.isOwned) {
  router.replace({
    name: 'all',
    params: { all: ['recipes', 'collections', id, 'edit'] },
  });
}

const editableRecipeCollection = $ref(
  recipeCollection ? klona(recipeCollection) : null
);

const submitRecipeCollection = () => {
  if (!editableRecipeCollection) {
    return;
  }

  recipeCollectionStore.editCollectionById(id, editableRecipeCollection);
  router.push('/recipes/collections/created-by-me');
};
</script>

<template>
  <TheRecipeCollectionForm
    v-if="editableRecipeCollection"
    v-model:recipe-collection="editableRecipeCollection"
    @submit-recipe-collection="submitRecipeCollection()"
  />
</template>
