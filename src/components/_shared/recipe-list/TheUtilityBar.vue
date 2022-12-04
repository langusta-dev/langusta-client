<script setup lang="ts">
import TheMobileBar from './the-utility-bar/TheMobileBar.vue';
import TheStandardBar from './the-utility-bar/TheStandardBar.vue';

import { useWindowWidthBreakpoints } from '~/composables/window';

const props = defineProps<{ search: string; editable: boolean }>();

const emit = defineEmits<{
  (e: 'update:search', v: string): void;
}>();

const router = useRouter();

const { search } = useVModels(props, emit);

const { isMd } = $(useWindowWidthBreakpoints());

const barComponent = $computed(() => (isMd ? TheStandardBar : TheMobileBar));
</script>

<template>
  <component
    :is="barComponent"
    v-model:search="search"
    :editable="editable"
    @add-recipe="router.push('/recipes/add')"
  />
</template>
