import { RecipeIngredientQuantityUnit } from '~/types/recipes';

interface QuantityUnitOption {
  value: RecipeIngredientQuantityUnit;
  label: string;
}

const QUANTITY_UNIT_OPTION_REDUCER = ({ value }: QuantityUnitOption) => value;

export const useQuantityUnit = () => {
  const { t } = useI18n();

  const quantityUnitOptions = $computed<QuantityUnitOption[]>(() => [
    {
      value: RecipeIngredientQuantityUnit.G,
      label: t('recipe.quantity.unit.g'),
    },
    {
      value: RecipeIngredientQuantityUnit.KG,
      label: t('recipe.quantity.unit.kg'),
    },
    {
      value: RecipeIngredientQuantityUnit.ML,
      label: t('recipe.quantity.unit.ml'),
    },
    {
      value: RecipeIngredientQuantityUnit.L,
      label: t('recipe.quantity.unit.l'),
    },
    {
      value: RecipeIngredientQuantityUnit.GLASS,
      label: t('recipe.quantity.unit.glass'),
    },
    {
      value: RecipeIngredientQuantityUnit.SPOON,
      label: t('recipe.quantity.unit.spoon'),
    },
    {
      value: RecipeIngredientQuantityUnit.TEASPOON,
      label: t('recipe.quantity.unit.teaspoon'),
    },
  ]);

  return $$({
    QUANTITY_UNIT_OPTION_REDUCER,
    quantityUnitOptions,
  });
};
