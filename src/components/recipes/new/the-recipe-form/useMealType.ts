import { RecipeMealType } from '~/types/recipe';

interface MealTypeOption {
  value: RecipeMealType;
  label: string;
}

const MEAL_TYPE_OPTION_REDUCER = ({ value }: MealTypeOption) => value;

export const useMealType = () => {
  const { t } = useI18n();

  const mealTypeOptions = $computed<MealTypeOption[]>(() => [
    {
      value: RecipeMealType.BREAKFAST,
      label: t('recipe.meal_type.breakfast'),
    },
    {
      value: RecipeMealType.LUNCH,
      label: t('recipe.meal_type.lunch'),
    },
    {
      value: RecipeMealType.APPETIZER,
      label: t('recipe.meal_type.appetizer'),
    },
    {
      value: RecipeMealType.DINNER,
      label: t('recipe.meal_type.dinner'),
    },
    {
      value: RecipeMealType.DESSERT,
      label: t('recipe.meal_type.dessert'),
    },
  ]);

  const mealType = $ref(RecipeMealType.LUNCH);

  return $$({
    MEAL_TYPE_OPTION_REDUCER,
    mealTypeOptions,
    mealType,
  });
};
