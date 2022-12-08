<script setup lang="ts">
import TheUtilityBar from './&shared/TheUtilityBar.vue';
import RecipeCollectionItem from './the-recipe-collection-list/RecipeCollectionItem.vue';

import { useSearchFilter } from './&shared/useSearchFilter';

import type { RecipeCollection } from '~/types/recipeCollection';
import type { Uuid } from '~/types/uuid';

const props = defineProps<{
  recipesCollections: RecipeCollection[];
  editable?: boolean;
  search?: string;
}>();

const emit = defineEmits<{
  (e: 'update:search', v: string): void;
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

const { filteredItems: recipeCollectionsToDisplay } = useSearchFilter(
  $$(search),
  computed(() => props.recipesCollections),
  ({ title, description }) => [title, description].join('')
);

const handleRecipeCollectionClick = (id: Uuid) => {
  router.push(`/recipes/collections/${id}`);
};
</script>

<template>
  <div _h-full _flex="~ col">
    <TheUtilityBar
      v-model:search="search"
      :editable="!!editable"
      :add-item-button-label="t('recipe_collections.add_recipe_collection')"
      add-item-button-target-path="/recipes/collections/add"
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
          <RecipeCollectionItem
            v-for="recipeCollection in recipeCollectionsToDisplay"
            :key="recipeCollection.id"
            :recipe-collection="recipeCollection"
            :editable="!!editable"
            @click="handleRecipeCollectionClick(recipeCollection.id)"
          />
        </BaseFadeTransitionGroup>
      </BaseScroll>

      <BaseFadeTransition>
        <div
          v-show="!recipeCollectionsToDisplay.length"
          _cover
          _text-center
          _pt6
          _op70
        >
          {{ t('recipe_collections.no_recipe_collections_to_display') }}
        </div>
      </BaseFadeTransition>
    </div>
  </div>
</template>
