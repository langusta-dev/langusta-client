<script setup lang="ts">
import { useRecipeStore } from '~/stores/recipe';

import { fetchRecipesByIds } from '~/api/recipe';

import type { Uuid } from '~/types/uuid';

const { id } = defineProps<{ id: Uuid }>();

const { t } = useI18n();
const router = useRouter();
const recipeStore = useRecipeStore();

const isRecipeLoading = $ref(false);

const recipe = $(
  computedAsync(
    async () => {
      const recipe = recipeStore.getRecipeById(id);

      if (recipe) {
        return recipe;
      }

      const recipes = await fetchRecipesByIds([id]);

      if (recipes?.length === 1) {
        return recipes[0];
      }

      return null;
    },
    null,
    $$(isRecipeLoading)
  )
);

whenever(
  () => !isRecipeLoading && !recipe,
  () => {
    router.replace({ name: 'all', params: { all: ['recipes', id] } });
  }
);

const preparationTimeUnit = $computed(() =>
  recipe
    ? t(
        `recipe.preparation_time.unit.${recipe.preparationTime.unit.toLowerCase()}`
      )
    : null
);
</script>

<template>
  <BaseFadeTransition>
    <BaseScroll v-if="recipe">
      <div _flex="~ col" _items-center _gap4 _p4>
        <div _text-xl>{{ recipe.title }}</div>

        <div
          v-if="recipe.imgPath"
          _w-full
          _h50
          _rounded
          :style="{ backgroundImage: `url(${recipe.imgPath})` }"
          _bg="cover center no-repeat"
        />

        <div _flex _gap4 _children="flex gap.5 items-center">
          <div>
            <div _icon-tabler-flame />
            <b>
              {{ recipe.calorieCount }}
            </b>
          </div>

          <div>
            <div
              _icon-material-symbols-nest-clock-farsight-analog-outline-rounded
            />
            <div>
              <b>
                {{ recipe.preparationTime.value }}
              </b>
            </div>
            <div>
              {{ preparationTimeUnit }}
            </div>
          </div>
        </div>

        <div v-if="recipe.description">
          {{ recipe.description }}
        </div>

        <div _w-full _flex="~ col" _items-center _gap2>
          <div _text-lg>Ingredients</div>

          <div v-for="({ name }, i) in recipe.ingredients" :key="i" _w-full>
            {{ i + 1 }}. {{ name }}
          </div>
        </div>

        <div v-if="recipe.steps" _w-full _flex="~ col" _items-center _gap2>
          <div _text-lg>Steps</div>

          <div v-for="({ description }, i) in recipe.steps" :key="i" _w-full>
            {{ i + 1 }}. {{ description }}
          </div>
        </div>
      </div>
    </BaseScroll>
  </BaseFadeTransition>
</template>
