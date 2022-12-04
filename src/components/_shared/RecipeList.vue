<script setup lang="ts">
import RecipeItem from './recipe-list/RecipeItem.vue';
import TheUtilityBar from './recipe-list/TheUtilityBar.vue';

import type { Recipe } from '~/types/recipe';
import type { Uuid } from '~/types/uuid';

const props = defineProps<{
  recipes: Recipe[];
  selectedRecipeIds?: Set<Uuid> | null;
  search?: string;
}>();

const emit = defineEmits<{
  (e: 'update:search', v: string): void;
  (e: 'update:selectedRecipeIds', v: Set<Uuid>): void;
}>();

const router = useRouter();

const search = $ref(props.search || '');
const selectedRecipeIds = $ref(props.selectedRecipeIds || null);

watch($$(search), (v) => {
  emit('update:search', v);
});

whenever($$(selectedRecipeIds), (v) => {
  emit('update:selectedRecipeIds', v);
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

const isEditable = $computed(() => !selectedRecipeIds);

const handleRecipeClick = (id: Uuid) => {
  if (selectedRecipeIds) {
    (selectedRecipeIds.has(id)
      ? selectedRecipeIds.delete
      : selectedRecipeIds.add)(id);

    return;
  }

  router.push(`/recipes/${id}`);
};
</script>

<template>
  <div _h-full _flex="~ col">
    <TheUtilityBar v-model:search="search" :editable="isEditable" />

    <div _grow _flex="~ wrap" _gap3 _p="x4 y2" _justify-center _content-start>
      <BaseScroll>
        <BaseFadeTransitionGroup>
          <RecipeItem
            v-for="recipe in recipesToDisplay"
            :key="recipe.id"
            :recipe="recipe"
            :editable="isEditable"
            @click="handleRecipeClick(recipe.id)"
          />
        </BaseFadeTransitionGroup>
      </BaseScroll>
    </div>
  </div>
</template>
