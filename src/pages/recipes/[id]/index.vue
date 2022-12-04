<script setup lang="ts">
import type { Uuid } from '~/types/uuid';

const { id } = defineProps<{ id: Uuid }>();
</script>

<template>
  <div>
    <div>Recipe: {{ id }}</div>
  </div>
</template>
