import Dexie from 'dexie';

import type { Table } from 'dexie';
import type { Idb } from '~/types/dataSync';
import type { MealPlan } from '~/types/mealPlan';
import type { Recipe } from '~/types/recipe';
import type { RecipeCollection } from '~/types/recipeCollection';

const SYNCHRONIZABLE_TABLE = 'id, data, toUpload, toDelete';

class IdbInstance extends Dexie {
  recipes!: Table<Idb<Recipe>>;
  recipeCollections!: Table<Idb<RecipeCollection>>;
  mealPlans!: Table<Idb<MealPlan>>;

  constructor() {
    super('langusta');
    this.version(1).stores({
      recipes: SYNCHRONIZABLE_TABLE,
      recipeCollections: SYNCHRONIZABLE_TABLE,
      mealPlan: SYNCHRONIZABLE_TABLE,
    });
  }
}

export const idb = new IdbInstance();
