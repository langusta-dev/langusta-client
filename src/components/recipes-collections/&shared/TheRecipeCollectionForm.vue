<script setup lang="ts">
import { useInputGroup } from '~/composables/input';

import { useTabs } from './the-recipe-collection-form/useTabs';

import type { EditableRecipeCollection } from '~/types/recipeCollection';

const props = defineProps<{ recipeCollection: EditableRecipeCollection }>();

const emit = defineEmits<{
  (e: 'update:recipeCollection', v: EditableRecipeCollection): void;
  (e: 'submitRecipeCollection'): void;
}>();

const { t } = useI18n();

const { injectValueByKey } = $(useInputGroup(['title', 'description']));

let title = $(injectValueByKey('title'));

let description = $(injectValueByKey('description'));

let { recipeCollection } = $(useVModels(props, emit));

watchEffect(() => {
  const newRecipeCollection: EditableRecipeCollection = {
    title,
    recipeIds: [], // @kw
  };

  const trimmedDescription = description.trim();

  if (trimmedDescription) {
    newRecipeCollection.description = trimmedDescription;
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

const {
  TabKey,
  TAB_KEYS,
  activeTabKey,
  isActiveTabKey,
  setActiveTabKey,
  getLocaleByTabKey,
} = useTabs();

const initializeForm = () => {
  title = props.recipeCollection.title;
  description = props.recipeCollection.description || '';
};

initializeForm();
</script>

<template>
  <div _flex="~ col" _gap4 _items-center _p="t6 b4">
    <div>
      <div>{{ t('recipe_collections.form.title') }}*</div>
      <BaseInput v-model="title" />
    </div>

    <div>
      <BaseButton @click="submitRecipeCollection()">
        {{ t('recipe_collections.form.submit') }}
      </BaseButton>
    </div>

    <BaseHr _w="9/10" />

    <div _flex _gap1>
      <BaseButton
        v-for="tabKey in TAB_KEYS"
        :key="tabKey"
        :alt="!isActiveTabKey(tabKey)"
        sm
        @click="setActiveTabKey(tabKey)"
      >
        {{ getLocaleByTabKey(tabKey) }}
      </BaseButton>
    </div>

    <div>
      <BaseFadeTransition>
        <div v-if="activeTabKey === TabKey.PublicRecipes">public recipes</div>
        <div v-else-if="activeTabKey === TabKey.UserRecipes">user recipes</div>
        <div v-else-if="activeTabKey === TabKey.Description">
          <BaseInput v-model="description" type="textarea" />
        </div>
      </BaseFadeTransition>
    </div>
  </div>
</template>
