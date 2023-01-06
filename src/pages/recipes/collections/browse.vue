<route lang="yaml">
meta:
  title: browse_recipe_collections.title
  auth: true
  nav: true
  navOrder: 2
  navIcon: emojione-monotone:pot-of-food
</route>

<script setup lang="ts">
import ThePageHeader from '~/components/&shared/ThePageHeader.vue';
import ThePublicRecipeCollectionList from '~/components/&shared/ThePublicRecipeCollectionList.vue';

const { t } = useI18n();
</script>

<template>
  <div _h-full _flex="~ col">
    <ThePageHeader>{{ t('browse_recipe_collections.title') }}</ThePageHeader>

    <ThePublicRecipeCollectionList />
  </div>
</template>
