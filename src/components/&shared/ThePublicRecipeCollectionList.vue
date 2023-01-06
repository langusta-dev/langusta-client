<script setup lang="ts">
import TheRecipeCollectionList from '~/components/&shared/TheRecipeCollectionList.vue';

import { fetchPublicRecipeCollections } from '~/api/recipeCollection';

import type { PublishedRecipeCollection } from '~/types/recipeCollection';
import type { Uuid } from '~/types/uuid';

const props = defineProps<{
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

const recipeCollections = $ref<PublishedRecipeCollection[]>([]);

const recipeCollectionIds = $computed(
  () => new Set(recipeCollections.map(({ id }) => id))
);

watchDebounced(
  $$(search),
  async () => {
    const newRecipeCollections = await fetchPublicRecipeCollections(
      search ? { search } : {}
    );

    if (newRecipeCollections) {
      recipeCollections.push(
        ...newRecipeCollections.filter(({ id }) => !recipeCollectionIds.has(id))
      );
    }
  },
  { immediate: true, debounce: 800, maxWait: 2000 }
);
</script>

<template>
  <TheRecipeCollectionList v-model:search="search" :recipes-collections="[]" />
</template>
