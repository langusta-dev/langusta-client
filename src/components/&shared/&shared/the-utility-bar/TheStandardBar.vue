<script setup lang="ts">
const props = defineProps<{
  search: string;
  editable: boolean;
  addItemButtonLabel: string;
}>();

const emit = defineEmits<{
  (e: 'update:search', v: string): void;
  (e: 'addRecipe'): void;
}>();

const { t } = useI18n();

const { search } = useVModels(props, emit);
</script>

<template>
  <div _p="t2 x2">
    <div _flex _justify-center _mb2 _relative>
      <BaseInput
        v-model="search"
        :placeholder="t('input.search')"
        _w="80 lg:110 xl:120"
      />

      <div v-if="editable" _absolute _inset="y-0 r-0" _flex _items-center>
        <BaseButton @click="emit('addRecipe')">
          {{ addItemButtonLabel }}
        </BaseButton>
      </div>
    </div>

    <BaseHr />
  </div>
</template>
