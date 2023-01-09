import { Day } from '~/types/basic';

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

export const generateMealPlanRecipesPerDay = (
  options: MealPlanOptions,
  recipes: Recipe[]
): MealPlanRecipesPerDay => {
  // TODO
  console.log('generating meal plan', options, recipes);
  return emptyMealPlanRecipesPerDay();
};
