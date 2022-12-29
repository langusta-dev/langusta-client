<script setup lang="ts">
import { useRecipeCollectionStore } from '~/stores/recipeCollection';

import { showConfirm } from '~/composables/confirm';

import type { RecipeCollection } from '~/types/recipeCollection';

const { recipeCollection, editable } = defineProps<{
  recipeCollection: RecipeCollection;
  editable: boolean;
}>();

const { t } = useI18n();
const router = useRouter();

const recipeCollectionStore = useRecipeCollectionStore();

const isEditable = $computed(
  () =>
    editable && recipeCollectionStore.isCollectionOwnedById(recipeCollection.id)
);

const handleEdit = () => {
  router.push(`/recipes/collections/${recipeCollection.id}/edit`);
};

const handleDelete = () => {
  showConfirm({
    msg: t('recipe_collections.delete_recipe_collection_confirm', {
      title: recipeCollection.title,
    }),
    cb: () => {
      recipeCollectionStore.deleteCollectionById(recipeCollection.id);
    },
  });
};
</script>

<template>
  <div
    _w38
    _h40
    _rounded
    _hover:bg-accent
    _hover:text-accent-contrast
    _border="1 primary-contrast"
    _transition-colors
    _cursor-pointer
    _select-none
    _p1
  >
    <div _h-full _flex="~ col" _items-center>
      <div _text="center sm lines-2" :title="recipeCollection.title">
        {{ recipeCollection.title }}
      </div>

      <div _flex _items-center _grow _gap1>
        <div _text-2xl>
          {{ recipeCollection.recipeIds.length }}
        </div>
        <div _icon-emojione-monotone:pot-of-food _text-3xl />
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
          :title="t('recipe_collections.edit_recipe_collection')"
          @click.stop="handleEdit()"
        >
          <div _icon-material-symbols-edit-rounded />
        </BaseButton>

        <BaseButton
          sm
          circle
          :title="t('recipe_collections.delete_recipe_collection')"
          @click.stop="handleDelete()"
        >
          <div _icon-material-symbols-delete-outline-rounded />
        </BaseButton>
      </div>
    </div>
  </div>
</template>
