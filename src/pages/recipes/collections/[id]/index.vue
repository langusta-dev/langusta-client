<route lang="yaml">
meta:
  auth: true
</route>

<script setup lang="ts">
import TheRecipeList from '~/components/&shared/TheRecipeList.vue';

import { useRecipeStore } from '~/stores/recipe';
import { useRecipeCollectionStore } from '~/stores/recipeCollection';

import { fetchRecipesByIds } from '~/api/recipe';
import { fetchRecipeCollectionsByIds } from '~/api/recipeCollection';

import type { Recipe } from '~/types/recipe';
import type { RecipeCollection } from '~/types/recipeCollection';
import type { Uuid } from '~/types/uuid';

const { id } = defineProps<{ id: Uuid }>();

const router = useRouter();
const recipeStore = useRecipeStore();
const recipeCollectionStore = useRecipeCollectionStore();

const isRecipeCollectionLoading = $ref(false);

const recipeCollection = $(
  computedAsync(
    async () => {
      const recipeCollection = recipeCollectionStore.getCollectionById(id);

      if (recipeCollection) {
        return recipeCollection;
      }

      const recipeCollections = await fetchRecipeCollectionsByIds([id]);

      if (recipeCollections?.length === 1) {
        return recipeCollections[0];
      }

      return null;
    },
    null,
    $$(isRecipeCollectionLoading)
  )
);

whenever(
  () => !isRecipeCollectionLoading && !recipeCollection,
  () => {
    router.replace({
      name: 'all',
      params: { all: ['recipes', 'collections', id] },
    });
  }
);

let recipes = $ref<Recipe[]>([]);

whenever(
  () => !isRecipeCollectionLoading && recipeCollection,
  async () => {
    const recipesToFetchIds: Uuid[] = [];

    const newRecipes = (recipeCollection as RecipeCollection).recipeIds
      .map(recipeStore.getRecipeById)
      .filter((item, i): item is Recipe => {
        if (!item) {
          recipesToFetchIds.push(
            (recipeCollection as RecipeCollection).recipeIds[i]
          );

          return false;
        }

        return true;
      });

    if (recipesToFetchIds.length) {
      newRecipes.push(...((await fetchRecipesByIds(recipesToFetchIds)) || []));
    }

    recipes = newRecipes;
  }
);
</script>

<template>
  <BaseFadeTransition>
    <div v-if="recipeCollection" _h-full _flex="~ col" _gap4 _pt4>
      <div _text="center 2xl" _fw600>{{ recipeCollection.title }}</div>

      <div v-if="recipeCollection.description" _px4>
        {{ recipeCollection.description }}
      </div>

      <TheRecipeList :recipes="recipes" />
    </div>
  </BaseFadeTransition>
</template>
