import { RecipePreparationTimeUnit } from '~/types/recipe';

interface PreparationTimeUnitOption {
  value: RecipePreparationTimeUnit;
  label: string;
}

const PREPARATION_TIME_UNIT_OPTION_REDUCER = ({
  value,
}: PreparationTimeUnitOption) => value;

export const usePreparationTimeUnit = () => {
  const { t } = useI18n();

  const preparationTimeUnitOptions = $computed<PreparationTimeUnitOption[]>(
    () => [
      {
        value: RecipePreparationTimeUnit.Minute,
        label: t('recipe.preparation_time.unit.minutes'),
      },
      {
        value: RecipePreparationTimeUnit.Hour,
        label: t('recipe.preparation_time.unit.hours'),
      },
    ]
  );

  const preparationTimeUnit = $ref(RecipePreparationTimeUnit.Minute);

  return $$({
    PREPARATION_TIME_UNIT_OPTION_REDUCER,
    preparationTimeUnitOptions,
    preparationTimeUnit,
  });
};
