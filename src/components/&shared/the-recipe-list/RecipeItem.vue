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
    _hover:bg-accent
    _hover:text-accent-contrast
    _border="1 primary-contrast"
    _transition-colors
    _cursor-pointer
    _select-none
    _p1
    :_outline="selected ? '~ 3 accent offset-0' : ''"
  >
    <div _h-full _flex="~ col" _items-center _relative _text-sm>
      <div _grow _relative _w-full _rounded _pointer-events-none>
        <div
          v-if="recipe.imgPath"
          _cover
          :style="{ backgroundImage: `url(${recipe.imgPath})` }"
          _bg="cover center no-repeat"
        />
        <div v-else _cover _flex _items-center _justify-center>
          <div _icon-emojione-monotone:pot-of-food _text-5xl />
        </div>
      </div>

      <div _text="center lines-2" :title="recipe.title">
        {{ recipe.title }}
      </div>

      <div
        _p="l1 b1"
        _flex="~ col"
        _w-full
        _children="flex gap.5 items-center"
        _whitespace-nowrap
        _overflow-hidden
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

      <div
        v-if="isEditable"
        _flex
        _justify-center
        _gap1
        _children="border-1 border-accent-contrast"
      >
        <BaseButton
          sm
          circle
          :title="t('recipes.edit_recipe')"
          @click.stop="handleEdit()"
        >
          <div _icon-material-symbols-edit-rounded />
        </BaseButton>

        <BaseButton
          sm
          circle
          :title="t('recipes.delete_recipe')"
          @click.stop="handleDelete()"
        >
          <div _icon-material-symbols-delete-outline-rounded />
        </BaseButton>
      </div>
    </div>
  </div>
</template>
