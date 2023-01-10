<route lang="yaml">
meta:
  title: recipe_collections_created_by_me.title
  auth: true
  nav: true
  navOrder: 4
  navIcon: [fa-solid:user, heroicons-solid:collection]
</route>

<script setup lang="ts">
import TheOwnedRecipeCollectionList from '~/components/&shared/TheOwnedRecipeCollectionList.vue';
</script>

<template>
  <div _h-full>
    <TheOwnedRecipeCollectionList editable />
  </div>
</template>
