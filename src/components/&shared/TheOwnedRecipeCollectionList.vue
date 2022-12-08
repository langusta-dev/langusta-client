<script setup lang="ts">
import TheRecipeCollectionList from '~/components/&shared/TheRecipeCollectionList.vue';

import { useRecipeCollectionStore } from '~/stores/recipeCollection';

import type { Uuid } from '~/types/uuid';

const props = defineProps<{
  editable?: boolean;
  search?: string;
}>();

const emit = defineEmits<{
  (e: 'update:search', v: string): void;
  (e: 'update:selectedRecipeIds', v: Set<Uuid>): void;
}>();

const search = $computed({
  get: () => props.search || '',
  set: (v) => {
    emit('update:search', v);
  },
});

const recipeCollectionStore = useRecipeCollectionStore();

const recipeCollectionsSorted = $computed(() =>
  recipeCollectionStore.ownedCollections.sort((a, b) =>
    a.title > b.title ? 1 : -1
  )
);
</script>

<template>
  <TheRecipeCollectionList
    v-model:search="search"
    :recipes-collections="recipeCollectionsSorted"
    :editable="!!editable"
  />
</template>
