import { Day } from '~/types/basic';
import { RecipeMealType } from '~/types/recipe';

import { mapDays } from './array';

import type {
  EditableMealPlan,
  MealPlanOptions,
  MealPlanRecipesPerDay,
} from '~/types/mealPlan';
import type { Recipe } from '~/types/recipe';
import type { RecipeCollection } from '~/types/recipeCollection';

const emptyMealPlanRecipesPerDay = (): MealPlanRecipesPerDay => ({
  [Day.Monday]: [],
  [Day.Tuesday]: [],
  [Day.Wednesday]: [],
  [Day.Thursday]: [],
  [Day.Friday]: [],
  [Day.Sunday]: [],
  [Day.Saturday]: [],
});

export const emptyMealPlan = (
  recipeCollectionId: RecipeCollection['id']
): EditableMealPlan => ({
  recipeCollectionId,
  dailyCalorieCount: 0,
  dailyMealCount: 0,
  recipesPerDay: emptyMealPlanRecipesPerDay(),
});

const MIN_DAILY_CALORIE_COUNT = 1000;
const MAX_DAILY_CALORIE_COUNT = 10_000;
const MIN_DAILY_MEAL_COUNT = 3;
const MAX_DAILY_MEAL_COUNT = 5;

export const areMealPlanOptionsValid = ({
  dailyCalorieCount,
  dailyMealCount,
}: MealPlanOptions) =>
  dailyCalorieCount >= MIN_DAILY_CALORIE_COUNT &&
  dailyCalorieCount <= MAX_DAILY_CALORIE_COUNT &&
  dailyMealCount >= MIN_DAILY_MEAL_COUNT &&
  dailyMealCount <= MAX_DAILY_MEAL_COUNT;

export const isMealPlanValid = ({
  dailyCalorieCount,
  dailyMealCount,
  recipesPerDay,
}: EditableMealPlan) =>
  areMealPlanOptionsValid({ dailyCalorieCount, dailyMealCount }) &&
  Object.values(recipesPerDay).every(
    (dailyRecipes) => dailyRecipes.length === dailyMealCount
  );

class MealPlanGenerationError extends Error {}

class InvalidMealPlanOptionsError extends MealPlanGenerationError {
  constructor() {
    super('Invalid meal plan options');
  }
}

class InvalidDailyMealCountError extends MealPlanGenerationError {
  constructor() {
    super('Invalid daily meal count');
  }
}

class InsufficientRecipeCountError extends MealPlanGenerationError {
  constructor() {
    super('Insufficient recipe count');
  }
}

type SequentialMealNumber = number;

type DailyMealCalorieCounts = Map<SequentialMealNumber, number>;

const generateDailyMealCalorieCounts = (
  options: MealPlanOptions
): DailyMealCalorieCounts | never => {
  const dailyMealCalorieCounts: DailyMealCalorieCounts = new Map();

  switch (options.dailyMealCount) {
    case 3: {
      dailyMealCalorieCounts.set(1, options.dailyCalorieCount * 0.35);
      dailyMealCalorieCounts.set(2, options.dailyCalorieCount * 0.45);
      dailyMealCalorieCounts.set(3, options.dailyCalorieCount * 0.2);
      break;
    }

    case 4: {
      dailyMealCalorieCounts.set(1, options.dailyCalorieCount * 0.25);
      dailyMealCalorieCounts.set(2, options.dailyCalorieCount * 0.1);
      dailyMealCalorieCounts.set(3, options.dailyCalorieCount * 0.35);
      dailyMealCalorieCounts.set(4, options.dailyCalorieCount * 0.3);
      break;
    }

    case 5: {
      dailyMealCalorieCounts.set(1, options.dailyCalorieCount * 0.25);
      dailyMealCalorieCounts.set(2, options.dailyCalorieCount * 0.1);
      dailyMealCalorieCounts.set(3, options.dailyCalorieCount * 0.35);
      dailyMealCalorieCounts.set(4, options.dailyCalorieCount * 0.1);
      dailyMealCalorieCounts.set(5, options.dailyCalorieCount * 0.2);
      break;
    }

    default: {
      throw new InvalidDailyMealCountError();
    }
  }

  return dailyMealCalorieCounts;
};

const MEAL_CALORIE_COUNT_PRECISION = 0.1;

const filterRecipesByMealTypesAndCalorieCount = (
  recipes: Recipe[],
  mealTypes: RecipeMealType[],
  calorieCount: number
): Recipe[] => {
  const mealTypesSet = new Set(mealTypes);
  return recipes.filter(
    (recipe) =>
      mealTypesSet.has(recipe.mealType) &&
      recipe.calorieCount >=
        calorieCount * (1 - MEAL_CALORIE_COUNT_PRECISION) &&
      recipe.calorieCount <= calorieCount * (1 + MEAL_CALORIE_COUNT_PRECISION)
  );
};

const { Appetizer, Breakfast, Dinner, Lunch, Snack } = RecipeMealType;

type PotentialRecipesForDay = Map<SequentialMealNumber, Recipe[]>;

const generatePotentialRecipesForDay = (
  dailyMealCalorieCounts: DailyMealCalorieCounts,
  recipes: Recipe[]
): PotentialRecipesForDay | never => {
  const potentialRecipesForDay: PotentialRecipesForDay = new Map();

  const getCalorieCount = (mealNumber: SequentialMealNumber): number =>
    dailyMealCalorieCounts.get(mealNumber) as number;

  const filterRecipes = (mealTypes: RecipeMealType[], calorieCount: number) =>
    filterRecipesByMealTypesAndCalorieCount(recipes, mealTypes, calorieCount);

  const setPotentialRecipesForDay = (
    mealNumber: SequentialMealNumber,
    mealTypes: RecipeMealType[]
  ) => {
    const filteredRecipes = filterRecipes(
      mealTypes,
      getCalorieCount(mealNumber)
    );

    if (!filteredRecipes.length) {
      throw new InsufficientRecipeCountError();
    }

    potentialRecipesForDay.set(mealNumber, filteredRecipes);
  };

  switch (dailyMealCalorieCounts.size) {
    case 3: {
      setPotentialRecipesForDay(1, [Breakfast]);
      setPotentialRecipesForDay(2, [Dinner]);
      setPotentialRecipesForDay(3, [Snack]);
      break;
    }

    case 4: {
      setPotentialRecipesForDay(1, [Breakfast]);
      setPotentialRecipesForDay(2, [Lunch, Snack]);
      setPotentialRecipesForDay(3, [Dinner]);
      setPotentialRecipesForDay(4, [Snack]);
      break;
    }

    case 5: {
      setPotentialRecipesForDay(1, [Breakfast]);
      setPotentialRecipesForDay(2, [Lunch, Snack]);
      setPotentialRecipesForDay(3, [Appetizer]);
      setPotentialRecipesForDay(4, [Dinner]);
      setPotentialRecipesForDay(5, [Snack]);
      break;
    }

    default: {
      throw new InvalidDailyMealCountError();
    }
  }

  return potentialRecipesForDay;
};

const extractRandomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const generateRecipesForDay = (
  dailyMealCalorieCounts: DailyMealCalorieCounts,
  recipes: Recipe[]
): Recipe[] | never => {
  const recipesForDayEntries: [SequentialMealNumber, Recipe][] = [];

  const potentialRecipesForDay = generatePotentialRecipesForDay(
    dailyMealCalorieCounts,
    recipes
  );

  for (const [
    mealNumber,
    potentialRecipes,
  ] of potentialRecipesForDay.entries()) {
    recipesForDayEntries.push([
      Number(mealNumber),
      extractRandomItem(potentialRecipes),
    ]);
  }

  return recipesForDayEntries
    .sort(([a], [b]) => a - b)
    .map(([, recipe]) => recipe);
};

export const generateMealPlanRecipesPerDay = (
  options: MealPlanOptions,
  recipes: Recipe[]
): MealPlanRecipesPerDay | never => {
  if (!areMealPlanOptionsValid(options)) {
    throw new InvalidMealPlanOptionsError();
  }

  const dailyMealCalorieCounts = generateDailyMealCalorieCounts(options);

  let remainingRecipes = [...recipes];

  return Object.assign(
    {},
    ...mapDays((day) => {
      const recipesForDay = generateRecipesForDay(
        dailyMealCalorieCounts,
        remainingRecipes
      );

      const recipesForDayIds = new Set(recipesForDay.map(({ id }) => id));

      remainingRecipes = remainingRecipes.filter(
        ({ id }) => !recipesForDayIds.has(id)
      );

      return { [day]: recipesForDay };
    })
  );
};
