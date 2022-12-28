<script setup lang="ts">
const props = defineProps<{ search: string; editable: boolean }>();

const emit = defineEmits<{
  (e: 'update:search', v: string): void;
  (e: 'addRecipe'): void;
}>();

// TODO open modal with search input
const { search } = useVModels(props, emit);
</script>

<template>
  <div
    _absolute
    _z1
    _inset="b-0 r-0"
    _flex
    _gap2
    _p4
    _pointer-events-none
    _children="h12 w12 rounded-full pointer-events-auto shadow-md"
  >
    <BaseButton v-if="editable" circle @click="emit('addRecipe')">
      <div>
        <div _icon-ic-round-plus _text-9 />
      </div>
    </BaseButton>

    <BaseButton circle>
      <div>
        <div _icon-ic-round-search _text-8 />
      </div>
    </BaseButton>
  </div>
</template>
