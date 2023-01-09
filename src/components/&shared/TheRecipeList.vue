<script setup lang="ts">
import TheUtilityBar from './&shared/TheUtilityBar.vue';
import RecipeItem from './the-recipe-list/RecipeItem.vue';

import { useSearchFilter } from './&shared/useSearchFilter';

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

let _search = $ref('');
const search = $computed({
  get: () => props.search || _search,
  set: (v) => {
    _search = v;
    emit('update:search', v);
  },
});

const { filteredItems: recipesToDisplay } = useSearchFilter(
  $$(search),
  computed(() => props.recipes),
  ({ title, description, steps, calorieCount, ingredients }) =>
    [
      title,
      description,
      steps ? steps.map(({ description }) => description).join('') : '',
      calorieCount,
      ingredients.map(({ name, quantity, quantityUnit }) =>
        [name, quantity, quantityUnit].join('')
      ),
    ].join('')
);

const selectedRecipeIds = $computed({
  get: () => props.selectedRecipeIds || null,
  set: (v) => {
    if (v) {
      emit('update:selectedRecipeIds', v);
    }
  },
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
    <TheUtilityBar
      v-model:search="search"
      :editable="isEditable"
      :add-item-button-label="t('recipes.add_recipe')"
      add-item-button-target-path="/recipes/add"
    />

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
        <div v-if="!recipesToDisplay.length" _cover _text-center _pt6 _op70>
          {{ t('recipes.no_recipes_to_display') }}
        </div>
      </BaseFadeTransition>
    </div>
  </div>
</template>
