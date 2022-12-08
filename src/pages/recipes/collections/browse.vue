<route lang="yaml">
meta:
  title: browse_recipe_collections.title
  auth: true
  nav: true
  navOrder: 2
  navIcon: emojione-monotone:pot-of-food
</route>

<script setup lang="ts">
import ThePublicRecipeCollectionList from '~/components/&shared/ThePublicRecipeCollectionList.vue';
</script>

<template>
  <div _h-full>
    <ThePublicRecipeCollectionList />
  </div>
</template>
