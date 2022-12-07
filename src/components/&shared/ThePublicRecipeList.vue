<script setup lang="ts">
import TheRecipeList from '~/components/&shared/TheRecipeList.vue';

import type { Uuid } from '~/types/uuid';

const props = defineProps<{
  selectedRecipeIds?: Set<Uuid> | null;
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

const selectedRecipeIds = $computed({
  get: () => props.selectedRecipeIds || null,
  set: (v) => {
    if (v) {
      emit('update:selectedRecipeIds', v);
    }
  },
});

// TODO
</script>

<template>
  <TheRecipeList
    v-model:selected-recipe-ids="selectedRecipeIds"
    v-model:search="search"
    :recipes="[]"
  />
</template>
