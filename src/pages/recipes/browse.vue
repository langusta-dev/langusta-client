<route lang="yaml">
meta:
  title: browse_recipes.title
  auth: true
  nav: true
  navOrder: 1
  navIcon: emojione-monotone:pot-of-food
</route>

<script setup lang="ts">
import ThePageHeader from '~/components/&shared/ThePageHeader.vue';
import ThePublicRecipeList from '~/components/&shared/ThePublicRecipeList.vue';

const { t } = useI18n();
</script>

<template>
  <div _h-full _flex="~ col">
    <ThePageHeader>{{ t('browse_recipes.title') }}</ThePageHeader>

    <ThePublicRecipeList />
  </div>
</template>
