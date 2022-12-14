<script setup lang="ts">
import {
  RecipeIngredientQuantityUnit,
  type RecipeIngredient,
} from '~/types/recipe';

import { useQuantityUnit } from './the-ingredient-list/useQuantityUnit';

const props = defineProps<{ ingredients: RecipeIngredient[] }>();

const emit = defineEmits<{
  (e: 'update:ingredients', v: RecipeIngredient[]): void;
}>();

const { t } = useI18n();

interface EditableRecipeIngredient {
  id: number;
  name: string;
  quantity: string;
  quantityUnit: RecipeIngredientQuantityUnit;
}

let editableIngredients = $ref<EditableRecipeIngredient[]>([]);

watchEffect(() => {
  emit(
    'update:ingredients',
    editableIngredients.map(({ id: _, name, quantity, quantityUnit }) => ({
      name,
      quantity: Number(quantity || 0),
      quantityUnit,
    }))
  );
});

let ingredientId = 0;
const addIngredient = () => {
  editableIngredients.push({
    id: ingredientId++,
    name: '',
    quantity: '',
    quantityUnit: RecipeIngredientQuantityUnit.G,
  });
};

const deleteIngredientById = (id: number) => {
  const index = editableIngredients.findIndex((item) => item.id === id);

  if (index !== -1) {
    editableIngredients.splice(index, 1);
  }
};

const { quantityUnitOptions, QUANTITY_UNIT_OPTION_REDUCER } = useQuantityUnit();

const initializeIngredients = () => {
  editableIngredients = props.ingredients.map<EditableRecipeIngredient>(
    ({ name, quantity, quantityUnit }) => ({
      id: ingredientId++,
      name,
      quantity: quantity ? String(quantity) : '',
      quantityUnit,
    })
  );
};

initializeIngredients();
</script>

<template>
  <div _flex="~ col" _gap2>
    <div _flex _justify-between _items-center>
      <div>{{ t('recipes.form.ingredients') }}</div>
      <BaseButton @click="addIngredient()">
        {{ t('recipes.form.add_ingredient') }}
      </BaseButton>
    </div>

    <div _flex="~ col" _gap4 _relative>
      <BaseFadeTransitionGroup>
        <div v-for="item in editableIngredients" :key="item.id" _w-full>
          <div _flex _gap2>
            <BaseInput
              v-model="item.name"
              :placeholder="t('recipes.form.ingredient.name')"
              _w="!0"
              _grow
            />

            <BaseButton alt circle @click="deleteIngredientById(item.id)">
              <div _icon-heroicons-outline-trash />
            </BaseButton>
          </div>

          <div _flex _gap2 _mt2 _children="!w0 grow">
            <BaseInput
              v-model="item.quantity"
              :placeholder="t('recipes.form.ingredient.quantity')"
              numeric
            />

            <BaseSelect
              v-model="item.quantityUnit"
              :options="quantityUnitOptions"
              :reduce="QUANTITY_UNIT_OPTION_REDUCER"
              label="label"
            />
          </div>
        </div>
      </BaseFadeTransitionGroup>
    </div>
  </div>
</template>
