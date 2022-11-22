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
      value: RecipeMealType.Breakfast,
      label: t('recipe.meal_type.breakfast'),
    },
    {
      value: RecipeMealType.Lunch,
      label: t('recipe.meal_type.lunch'),
    },
    {
      value: RecipeMealType.Appetizer,
      label: t('recipe.meal_type.appetizer'),
    },
    {
      value: RecipeMealType.Dinner,
      label: t('recipe.meal_type.dinner'),
    },
    {
      value: RecipeMealType.Dessert,
      label: t('recipe.meal_type.dessert'),
    },
  ]);

  const mealType = $ref(RecipeMealType.Lunch);

  return $$({
    MEAL_TYPE_OPTION_REDUCER,
    mealTypeOptions,
    mealType,
  });
};
