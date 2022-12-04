<script setup lang="ts">
import TheRecipeCollectionForm from '~/components/recipes-collections/&shared/TheRecipeCollectionForm.vue';

const newRecipeCollection = $ref(null);

const submitRecipeCollection = () => {
  //
};
</script>

<template>
  <TheRecipeCollectionForm
    v-model:recipe-collection="newRecipeCollection"
    @submit-recipe-collection="submitRecipeCollection()"
  />
</template>
