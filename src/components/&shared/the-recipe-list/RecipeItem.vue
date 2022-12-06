<script setup lang="ts">
import { useRecipeStore } from '~/stores/recipe';

import { showConfirm } from '~/composables/confirm';

import type { Recipe } from '~/types/recipe';

const { recipe, editable, selected } = defineProps<{
  recipe: Recipe;
  editable: boolean;
  selected: boolean;
}>();

const { t } = useI18n();
const router = useRouter();

const recipeStore = useRecipeStore();

const isEditable = $computed(
  () => editable && recipeStore.isRecipeOwnedById(recipe.id)
);

const preparationTimeUnit = $computed(() =>
  t(`recipe.preparation_time.unit.${recipe.preparationTime.unit.toLowerCase()}`)
);

const mealType = $computed(() =>
  t(`recipe.meal_type.${recipe.mealType.toLowerCase()}`)
);

const handleEdit = () => {
  router.push(`/recipes/${recipe.id}/edit`);
};

const handleDelete = () => {
  showConfirm({
    msg: t('recipes.delete_recipe_confirm', { title: recipe.title }),
    cb: () => {
      recipeStore.deleteRecipeById(recipe.id);
    },
  });
};
</script>

<template>
  <div
    _w38
    _h50
    _rounded
    _bg="#fff/60 hover:accent"
    _text="#222 hover:accent-contrast"
    _transition-all
    _cursor-pointer
    _select-none
    _p1
  >
    <div _h-full _flex="~ col" _items-center>
      <div
        v-if="isEditable"
        _flex
        _justify-center
        _gap1
        _pb1
        _children="border-1 border-accent-contrast"
      >
        <BaseButton sm alt @click.stop="handleEdit()">
          <div _icon-material-symbols-edit-rounded />
        </BaseButton>

        <BaseButton sm alt @click.stop="handleDelete()">
          <div _icon-material-symbols-delete-outline-rounded />
        </BaseButton>
      </div>

      <div _text="center 3.5" _leading="3.5">
        {{ recipe.title }}
      </div>

      <div _grow />

      <div
        _p="l1 b1"
        _flex="~ col"
        _w-full
        _text-sm
        _children="flex gap.5 items-center"
      >
        <div>
          <div
            _icon-material-symbols-nest-clock-farsight-analog-outline-rounded
          />
          <div>
            <b>
              {{ recipe.preparationTime.value }}
            </b>
          </div>
          <div>
            {{ preparationTimeUnit }}
          </div>
        </div>
        <div>
          <div _icon-tabler-flame />

          <div>
            <b>
              {{ recipe.calorieCount }}
            </b>
          </div>
        </div>
      </div>

      <div>
        <i>
          {{ mealType }}
        </i>
      </div>
    </div>
  </div>
</template>