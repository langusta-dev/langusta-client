<route lang="yaml">
meta:
  auth: true
</route>

<script setup lang="ts">
import TheRecipeForm from '~/components/recipes/&shared/TheRecipeForm.vue';
</script>

<template>
  <div _flex="~ col" _items-center>
    <BaseScroll>
      <TheRecipeForm />
    </BaseScroll>
  </div>
</template>
