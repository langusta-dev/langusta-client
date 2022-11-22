import type { Day } from './basic';
import type { SynchronizableData } from './dataSync';
import type { Recipe } from './recipe';

export interface MealPlan extends SynchronizableData {
  recipesPerDay: Record<Day, Recipe[]>;
}
