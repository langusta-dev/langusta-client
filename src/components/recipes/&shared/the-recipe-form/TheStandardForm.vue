<script setup lang="ts">
const props = defineProps<{ enableSteps: boolean }>();

const emit = defineEmits<{
  (e: 'update:enableSteps', v: boolean): void;
}>();

const { t } = useI18n();

const { enableSteps } = useVModels(props, emit);
</script>

<template>
  <div
    _flex
    _my4
    :_children="`flex-(~ col) gap4 px3 ${
      enableSteps ? 'min-w-1/3' : 'min-w-1/2'
    }`"
  >
    <BaseFadeTransitionGroup>
      <div>
        <slot name="main" />

        <div>
          <BaseCheckbox
            v-model="enableSteps"
            :label="t('recipes.form.show_steps')"
          />
        </div>
      </div>

      <div>
        <slot name="ingredients" />
      </div>

      <div v-if="enableSteps">
        <slot name="steps" />
      </div>
    </BaseFadeTransitionGroup>
  </div>
</template>
