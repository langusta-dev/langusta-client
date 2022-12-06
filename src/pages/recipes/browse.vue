<route lang="yaml">
meta:
  title: browse_recipes.title
  auth: true
  nav: true
  navOrder: 1
  navIcon: emojione-monotone:pot-of-food
</route>

<script setup lang="ts">
import ThePublicRecipeList from '~/components/&shared/ThePublicRecipeList.vue';
</script>

<template>
  <div _h-full>
    <ThePublicRecipeList />
  </div>
</template>
