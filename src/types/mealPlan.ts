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
  recipeIdsPerDay: MealPlanRecipeIdsPerDay;
}

export type EditableMealPlan = Editable<MealPlan>;

export class MealPlanGenerationError extends Error {}

export class InvalidMealPlanOptionsError extends MealPlanGenerationError {
  constructor() {
    super('Invalid meal plan options');
  }
}

export class InvalidDailyMealCountError extends MealPlanGenerationError {
  constructor() {
    super('Invalid daily meal count');
  }
}

export class InsufficientRecipeCountError extends MealPlanGenerationError {
  constructor() {
    super('Insufficient recipe count');
  }
}
