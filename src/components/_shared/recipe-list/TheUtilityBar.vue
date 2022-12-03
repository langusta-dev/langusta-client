<script setup lang="ts">
const props = defineProps<{ search: string }>();

const emit = defineEmits<{
  (e: 'update:search', v: string): void;
}>();

const { search } = useVModels(props, emit);
</script>

<template>
  <div _flex>
    <BaseInput v-model="search" />
  </div>
</template>
