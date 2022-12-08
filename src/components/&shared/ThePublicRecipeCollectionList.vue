<script setup lang="ts">
import TheRecipeCollectionList from '~/components/&shared/TheRecipeCollectionList.vue';

import type { Uuid } from '~/types/uuid';

const props = defineProps<{
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

// TODO
</script>

<template>
  <TheRecipeCollectionList v-model:search="search" :recipes-collections="[]" />
</template>
