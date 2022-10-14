<route lang="yaml">
meta:
  auth: true
</route>

<script setup lang="ts">
import { useInputGroup } from '~/composables/input'

const { injectValueByKey } = $(
  useInputGroup(['title', 'description', 'calorieCount', 'preparationTime'])
)

const description = injectValueByKey('description')
</script>

<template>
  <div>
    <BaseInput v-model="description" type="textarea" />
  </div>
</template>
