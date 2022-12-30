<route lang="yaml">
meta:
  auth: true
  title: recipe_collections.edit_recipe_collection
</route>

<script setup lang="ts">
import ThePageHeader from '~/components/&shared/ThePageHeader.vue';
import TheRecipeCollectionForm from '~/components/recipes-collections/&shared/TheRecipeCollectionForm.vue';

import { useRecipeCollectionStore } from '~/stores/recipeCollection';

import type { Uuid } from '~/types/uuid';

const { id } = defineProps<{ id: Uuid }>();

const { t } = useI18n();
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

const submitRecipeCollection = async () => {
  if (!editableRecipeCollection) {
    return;
  }

  await recipeCollectionStore.editCollectionById(id, editableRecipeCollection);
  router.push('/recipes/collections/created-by-me');
};
</script>

<template>
  <div _h-full _flex="~ col">
    <ThePageHeader>
      {{ t('recipe_collections.edit_recipe_collection') }}
    </ThePageHeader>

    <TheRecipeCollectionForm
      v-if="editableRecipeCollection"
      v-model:recipe-collection="editableRecipeCollection"
      _grow
      @submit-recipe-collection="submitRecipeCollection()"
    />
  </div>
</template>
