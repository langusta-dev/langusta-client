<script setup lang="ts">
import TheOwnedRecipeList from '~/components/&shared/TheOwnedRecipeList.vue';
import ThePublicRecipeList from '~/components/&shared/ThePublicRecipeList.vue';
import TheRecipeList from '~/components/&shared/TheRecipeList.vue';

import { useRecipeStore } from '~/stores/recipe';

import { useInputGroup } from '~/composables/input';

import { useTabs } from './the-recipe-collection-form/useTabs';

import type { Recipe } from '~/types/recipe';
import type { EditableRecipeCollection } from '~/types/recipeCollection';
import type { Uuid } from '~/types/uuid';

const props = defineProps<{ recipeCollection: EditableRecipeCollection }>();

const emit = defineEmits<{
  (e: 'update:recipeCollection', v: EditableRecipeCollection): void;
  (e: 'submitRecipeCollection'): void;
}>();

const { t } = useI18n();
const recipeStore = useRecipeStore();

const { injectValueByKey } = $(useInputGroup(['title', 'description']));

let title = $(injectValueByKey('title'));

let description = $(injectValueByKey('description'));

let recipeIdsSet = $ref(new Set<Uuid>());

const recipeIds = $computed(() => [...recipeIdsSet]);

const trimmedDescription = $computed(() => description.trim());

const isPublishable = $computed(() => !!trimmedDescription);

const isPublic = $ref(false);

let { recipeCollection } = $(useVModels(props, emit));

// TODO isPublic
watchEffect(() => {
  const newRecipeCollection: EditableRecipeCollection = {
    title,
    recipeIds,
  };

  if (trimmedDescription) {
    newRecipeCollection.description = trimmedDescription;
  }

  if (isPublishable && isPublic) {
    newRecipeCollection.isPublic = isPublic;
  }

  recipeCollection = newRecipeCollection;
});

const isRecipeCollectionComplete = computed(() => !!recipeCollection.title);

const submitRecipeCollection = () => {
  if (!isRecipeCollectionComplete) {
    return;
  }

  emit('submitRecipeCollection');
};

const { TabKey, TAB_KEYS, activeTabKey, setActiveTabKey, getLocaleByTabKey } =
  $(useTabs());

const sharedRecipeSearch = $ref('');

const selectedRecipes = $computed(
  () => recipeIds.map(recipeStore.getRecipeById) as Recipe[]
);

let lazySelectedRecipes = $ref<Recipe[]>([]);

whenever(
  () => activeTabKey === TabKey.SelectedRecipes,
  () => {
    lazySelectedRecipes = [...selectedRecipes];
  }
);

const initializeForm = () => {
  title = props.recipeCollection.title;
  description = props.recipeCollection.description || '';
  recipeIdsSet = new Set(props.recipeCollection.recipeIds);
};

initializeForm();
</script>

<template>
  <div _flex="~ col" _gap1 _items-center>
    <div _flex="~ col" _gap="2 lg:4" _items-center>
      <BaseInput
        v-model="title"
        :placeholder="t('recipe_collections.form.title') + '*'"
      />

      <BaseCheckbox
        v-model="isPublic"
        :label="t('recipe_collections.form.is_public')"
      />

      <div _pb1>
        <BaseButton
          :disabled="!isRecipeCollectionComplete"
          @click="submitRecipeCollection()"
        >
          {{ t('recipe_collections.form.submit') }}
        </BaseButton>
      </div>

      <div _flex="~ wrap" _justify-center _gap1>
        <BaseButton
          v-for="tabKey in TAB_KEYS"
          :key="tabKey"
          :alt="tabKey !== activeTabKey"
          sm
          @click="setActiveTabKey(tabKey)"
        >
          {{ getLocaleByTabKey(tabKey) }}
        </BaseButton>
      </div>
    </div>

    <div _w-full _grow>
      <BaseFadeTransition>
        <ThePublicRecipeList
          v-if="activeTabKey === TabKey.PublicRecipes"
          v-model:selected-recipe-ids="recipeIdsSet"
          v-model:search="sharedRecipeSearch"
        />

        <TheOwnedRecipeList
          v-else-if="activeTabKey === TabKey.UserRecipes"
          v-model:selected-recipe-ids="recipeIdsSet"
          v-model:search="sharedRecipeSearch"
        />

        <TheRecipeList
          v-else-if="activeTabKey === TabKey.SelectedRecipes"
          v-model:selected-recipe-ids="recipeIdsSet"
          v-model:search="sharedRecipeSearch"
          :recipes="lazySelectedRecipes"
        />

        <div
          v-else-if="activeTabKey === TabKey.Description"
          _flex
          _justify-center
          _pb4
        >
          <BaseInput v-model="description" type="textarea" />
        </div>
      </BaseFadeTransition>
    </div>
  </div>
</template>
