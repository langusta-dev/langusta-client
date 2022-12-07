<route lang="yaml">
meta:
  title: recipes_created_by_me.title
  auth: true
  nav: true
  navOrder: 3
  navIcon: emojione-monotone:pot-of-food
</route>

<script setup lang="ts">
import TheOwnedRecipeList from '~/components/&shared/TheOwnedRecipeList.vue';
</script>

<template>
  <div _h-full>
    <TheOwnedRecipeList editable />
  </div>
</template>
