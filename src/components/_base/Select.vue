<script setup lang="ts">
import VSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

import colors from '~/../unocss.colors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Option = string | number | Record<string, any>;

interface Props {
  modelValue: Option | null;
  options: Option[];
  label?: string;
  clearable?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reduce?: (option: any) => Option;
}

const {
  modelValue,
  options,
  label,
  clearable = false,
  reduce,
} = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: Option): void;
}>();
</script>

<template>
  <VSelect
    class="base-select"
    :model-value="modelValue"
    :options="options"
    :label="label"
    :clearable="clearable"
    :reduce="reduce"
    @update:model-value="(v: Option) => emit('update:modelValue', v)"
  />
</template>

<style lang="scss" scoped>
// eslint-disable-next-line vue-scoped-css/require-selector-used-inside
.base-select {
  // https://vue-select.org/guide/css.html#available-css-variables-3-18

  --vs-colors--primary: v-bind('colors.primary.DEFAULT');
  --vs-colors--contrast: v-bind('colors.primary.contrast.DEFAULT');

  /* Search Input */
  --vs-search-input-color: var(--vs-colors--contrast);
  --vs-search-input-bg: var(--vs-colors--primary);
  --vs-search-input-placeholder-color: rgba(34, 34, 34, 0.75);

  /* Font */
  --vs-font-size: 1rem;
  --vs-line-height: 1.4;

  /* Disabled State */
  --vs-state-disabled-bg: var(--vs-colors--primary);
  --vs-state-disabled-color: rgba(34, 34, 34, 0.75);
  --vs-state-disabled-controls-color: var(--vs-controls-color);
  --vs-state-disabled-cursor: not-allowed;

  /* Borders */
  --vs-border-color: rgba(34, 34, 34, 0.3);
  --vs-border-width: 1px;
  --vs-border-style: solid;
  --vs-border-radius: 0.5rem;

  /* Actions: house the component controls */
  --vs-actions-padding: 0.25rem 0.4rem 0 0.2rem;

  /* Component Controls: Clear, Open Indicator */
  --vs-controls-color: rgba(34, 34, 34, 0.6);
  --vs-controls-size: 1;
  --vs-controls--deselect-text-shadow: 0 1px 0 #fff;

  /* Selected */
  --vs-selected-bg: var(--vs-colors--primary);
  --vs-selected-color: var(--vs-colors--contrast);
  --vs-selected-border-color: var(--vs-border-color);
  --vs-selected-border-style: var(--vs-border-style);
  --vs-selected-border-width: var(--vs-border-width);

  /* Dropdown */
  --vs-dropdown-bg: var(--vs-colors--primary);
  --vs-dropdown-color: inherit;
  --vs-dropdown-z-index: 1;
  --vs-dropdown-min-width: 8rem;
  --vs-dropdown-max-height: 20rem;
  --vs-dropdown-box-shadow: 0 0.1rem 0.2rem 0 rgba(0, 0, 0, 0.05);

  /* Options */
  --vs-dropdown-option-bg: var(--vs-colors--primary);
  --vs-dropdown-option-color: var(--vs-dropdown-color);
  --vs-dropdown-option-padding: 0.1rem 0.5rem;

  /* Active State */
  --vs-dropdown-option--active-bg: v-bind('colors.accent.DEFAULT');
  --vs-dropdown-option--active-color: v-bind('colors.accent.contrast.DEFAULT');

  /* Deselect State */
  --vs-dropdown-option--deselect-bg: #fb5858;
  --vs-dropdown-option--deselect-color: #fff;

  /* Transitions */
  --vs-transition-timing-function: cubic-bezier(1, -0.115, 0.975, 0.855);
  --vs-transition-duration: 150ms;

  @apply rounded-[var(--vs-border-radius)]
      outline-(~ 2 offset--1 transparent)
      transition-all;

  &:hover {
    @apply outline-accent;
  }

  &.vs--open {
    @apply outline-accent-focus;
  }
}

// eslint-disable-next-line vue-scoped-css/no-unused-selector, vue-scoped-css/require-selector-used-inside
.dark {
  .base-select {
    --vs-colors--primary: v-bind('colors.primary[":dark"]');
    --vs-colors--contrast: v-bind('colors.primary.contrast[":dark"]');

    --vs-border-color: rgba(250, 250, 250, 0.3);

    --vs-controls-color: rgba(250, 250, 250, 0.6);
  }
}
</style>
