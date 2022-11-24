<script setup lang="ts">
const props = defineProps<{ enableSteps: boolean }>();

const emit = defineEmits<{
  (e: 'update:enableSteps', v: boolean): void;
}>();

const { t } = useI18n();

const { enableSteps } = useVModels(props, emit);
</script>

<template>
  <div _flex="~ col" _gap4 _my4>
    <BaseFadeTransitionGroup>
      <slot name="main" />

      <BaseHr />

      <div>
        <BaseCheckbox
          v-model="enableSteps"
          :label="t('recipes.form.show_steps')"
        />
      </div>

      <div v-if="enableSteps">
        <slot name="steps" />
      </div>

      <BaseHr />

      <div>
        <slot name="ingredients" />
      </div>

      <slot name="submit-button" />
    </BaseFadeTransitionGroup>
  </div>
</template>
