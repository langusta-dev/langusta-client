import type { Day } from './basic';
import type { Editable, SynchronizableData } from './dataSync';
import type { RecipeCollection } from './recipeCollection';
import type { Uuid } from './uuid';

export interface MealPlanOptions {
  dailyCalorieCount: number;
  dailyMealCount: number;
}

export type MealPlanRecipeIdsPerDay = Record<Day, Uuid[]>;

export interface MealPlan extends MealPlanOptions, SynchronizableData {
  recipeCollectionId: RecipeCollection['id'];
  recipesPerDay: MealPlanRecipeIdsPerDay;
}

export type EditableMealPlan = Editable<MealPlan>;
