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
    _h50
    _rounded
    _bg="#fff/60 hover:accent"
    _text="#222 hover:accent-contrast"
    _transition-colors
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

      <div _text="center 3.5" _leading="3.5">
        {{ recipeCollection.title }}
      </div>

      <div _grow />

      <div>
        <i>
          {{ recipeCollection.recipeIds.length }}
        </i>
      </div>
    </div>
  </div>
</template>
