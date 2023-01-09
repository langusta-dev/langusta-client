import type { Day } from './basic';
import type { Editable, SynchronizableData } from './dataSync';
import type { Recipe } from './recipe';
import type { RecipeCollection } from './recipeCollection';

export interface MealPlanOptions {
  dailyCalorieCount: number;
  dailyMealCount: number;
}

export type MealPlanRecipesPerDay = Record<Day, Recipe[]>;

export interface MealPlan extends MealPlanOptions, SynchronizableData {
  recipeCollectionId: RecipeCollection['id'];
  recipesPerDay: MealPlanRecipesPerDay;
}

export type EditableMealPlan = Editable<MealPlan>;
