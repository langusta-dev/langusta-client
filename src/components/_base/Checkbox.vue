<script setup lang="ts">
const props = defineProps<{ modelValue: boolean; label: string }>();
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>();
const { modelValue } = $(useVModels(props, emit));
</script>

<template>
  <div _flex _select-none>
    <div
      class="group"
      _flex
      _items-center
      _gap2
      _cursor-pointer
      @click="modelValue = !modelValue"
    >
      <div
        _w4
        _h4
        _flex
        _relative
        _rounded
        _overflow-hidden
        _bg="primary-contrast/30"
        :_outline="`~ 2px offset-0 transparent ${
          !modelValue ? 'group-hover:accent' : ''
        }`"
        _transition="colors property-[outline]"
      >
        <BaseFadeTransition>
          <div v-if="modelValue" _cover _bg-accent _pointer-events-none />
        </BaseFadeTransition>
      </div>

      <div>
        {{ label }}
      </div>
    </div>
  </div>
</template>
