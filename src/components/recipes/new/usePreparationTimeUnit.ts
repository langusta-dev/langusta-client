import { RecipePreparationTimeUnit } from '~/types/recipes';

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
      { value: RecipePreparationTimeUnit.MINUTE, label: t('time.minutes') },
      { value: RecipePreparationTimeUnit.HOUR, label: t('time.hours') },
    ]
  );

  const preparationTimeUnit = $ref(RecipePreparationTimeUnit.MINUTE);

  return $$({
    PREPARATION_TIME_UNIT_OPTION_REDUCER,
    preparationTimeUnitOptions,
    preparationTimeUnit,
  });
};
