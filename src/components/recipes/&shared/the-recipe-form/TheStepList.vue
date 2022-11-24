<script setup lang="ts">
import type { RecipeStep } from '~/types/recipe';

const props = defineProps<{ steps: RecipeStep[] }>();

const emit = defineEmits<{
  (e: 'update:steps', v: RecipeStep[]): void;
}>();

const { t } = useI18n();

interface EditableRecipeStep extends RecipeStep {
  id: number;
}

let editableSteps = $ref<EditableRecipeStep[]>([]);

watchEffect(() => {
  emit(
    'update:steps',
    editableSteps.map(({ id: _, description }) => ({ description }))
  );
});

let stepId = 0;
const addStep = () => {
  editableSteps.push({ id: stepId++, description: '' });
};

const deleteStepById = (id: number) => {
  const index = editableSteps.findIndex((item) => item.id === id);

  if (index !== -1) {
    editableSteps.splice(index, 1);
  }
};

const swapSteps = (indexA: number, indexB: number) => {
  if (
    indexA < 0 ||
    indexA >= editableSteps.length ||
    indexB < 0 ||
    indexB >= editableSteps.length
  ) {
    return;
  }

  [editableSteps[indexA], editableSteps[indexB]] = [
    editableSteps[indexB],
    editableSteps[indexA],
  ];
};

const initializeSteps = () => {
  editableSteps = props.steps.map<EditableRecipeStep>(({ description }) => ({
    id: stepId++,
    description,
  }));
};

initializeSteps();
</script>

<template>
  <div _flex="~ col" _gap2>
    <div _flex _justify-between _items-center>
      <div>{{ t('recipes.form.steps') }}</div>
      <BaseButton @click="addStep()">
        {{ t('recipes.form.add_step') }}
      </BaseButton>
    </div>

    <div _flex="~ col" _gap4 _relative>
      <BaseFadeTransitionGroup>
        <div v-for="(item, i) in editableSteps" :key="item.id" _w-full>
          <div _flex _justify-between _mb2>
            <div># {{ i + 1 }}</div>

            <div _flex _gap2 _children="!px2">
              <BaseButton alt :disabled="!i" @click="swapSteps(i, i - 1)">
                <div _icon-material-symbols-keyboard-arrow-up-rounded />
              </BaseButton>

              <BaseButton
                alt
                :disabled="i === editableSteps.length - 1"
                @click="swapSteps(i, i + 1)"
              >
                <div _icon-material-symbols-keyboard-arrow-down-rounded />
              </BaseButton>

              <BaseButton alt @click="deleteStepById(item.id)">
                <div _icon-heroicons-outline-trash />
              </BaseButton>
            </div>
          </div>

          <BaseInput
            v-model="item.description"
            :placeholder="t('recipes.form.step.description')"
            type="textarea"
          />
        </div>
      </BaseFadeTransitionGroup>
    </div>
  </div>
</template>
