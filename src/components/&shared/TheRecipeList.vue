<script setup lang="ts">
import RecipeItem from './the-recipe-list/RecipeItem.vue';
import TheUtilityBar from './the-recipe-list/TheUtilityBar.vue';

import type { Recipe } from '~/types/recipe';
import type { Uuid } from '~/types/uuid';

const props = defineProps<{
  recipes: Recipe[];
  editable?: boolean;
  selectedRecipeIds?: Set<Uuid> | null;
  search?: string;
}>();

const emit = defineEmits<{
  (e: 'update:search', v: string): void;
  (e: 'update:selectedRecipeIds', v: Set<Uuid>): void;
}>();

const { t } = useI18n();
const router = useRouter();

const search = $computed({
  get: () => props.search || '',
  set: (v) => {
    emit('update:search', v);
  },
});

const selectedRecipeIds = $computed({
  get: () => props.selectedRecipeIds || null,
  set: (v) => {
    if (v) {
      emit('update:selectedRecipeIds', v);
    }
  },
});

const trimmedSearch = $computed(() =>
  search ? search.replace(/\s/g, '') : ''
);

const foundSearchIndexPerRecipeId = $computed(
  () =>
    new SafeMap<Uuid, number>(
      props.recipes.map(
        ({ id, title, description, steps, calorieCount, ingredients }) => [
          id,
          (() =>
            [
              title,
              description,
              steps ? steps.map(({ description }) => description).join('') : '',
              calorieCount,
              ingredients.map(({ name, quantity, quantityUnit }) =>
                [name, quantity, quantityUnit].join('')
              ),
            ]
              .join('')
              .indexOf(trimmedSearch))(),
        ]
      ),
      { defaultSetter: () => -1 }
    )
);

const recipesToDisplay = $computed(() => {
  if (!trimmedSearch) {
    return props.recipes;
  }

  return props.recipes
    .filter(({ id }) => foundSearchIndexPerRecipeId.get(id) !== -1)
    .sort(
      (a, b) =>
        foundSearchIndexPerRecipeId.get(a.id) -
        foundSearchIndexPerRecipeId.get(b.id)
    );
});

const isEditable = $computed(() => !!props.editable && !selectedRecipeIds);

const handleRecipeClick = (id: Uuid) => {
  if (selectedRecipeIds) {
    if (selectedRecipeIds.has(id)) {
      selectedRecipeIds.delete(id);
    } else {
      selectedRecipeIds.add(id);
    }

    return;
  }

  router.push(`/recipes/${id}`);
};
</script>

<template>
  <div _h-full _flex="~ col">
    <TheUtilityBar v-model:search="search" :editable="isEditable" />

    <div
      _grow
      _flex="~ wrap"
      _gap4
      _p="x4 y2"
      _justify-center
      _content-start
      _relative
    >
      <BaseScroll>
        <BaseFadeTransitionGroup>
          <RecipeItem
            v-for="recipe in recipesToDisplay"
            :key="recipe.id"
            :recipe="recipe"
            :editable="isEditable"
            :selected="!!selectedRecipeIds?.has(recipe.id)"
            @click="handleRecipeClick(recipe.id)"
          />
        </BaseFadeTransitionGroup>
      </BaseScroll>

      <BaseFadeTransition>
        <div v-show="!recipesToDisplay.length" _cover _text-center _pt6 _op70>
          {{ t('recipes.no_recipes_to_display') }}
        </div>
      </BaseFadeTransition>
    </div>
  </div>
</template>
