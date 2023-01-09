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

let _search = $ref('');
const search = $computed({
  get: () => props.search || _search,
  set: (v) => {
    _search = v;
    emit('update:search', v);
  },
});

const recipeCollectionStore = useRecipeCollectionStore();
</script>

<template>
  <TheRecipeCollectionList
    v-model:search="search"
    :recipes-collections="recipeCollectionStore.ownedCollectionsOrderedByTitle"
    :editable="!!editable"
  />
</template>
