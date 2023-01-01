import Dexie from 'dexie';

import type { Table } from 'dexie';
import type { IdbData } from '~/types/dataSync';
import type { MealPlan } from '~/types/mealPlan';
import type { Recipe } from '~/types/recipe';
import type { RecipeCollection } from '~/types/recipeCollection';

const SYNCHRONIZABLE_TABLE = 'id, data, toUpload, toDelete';

class IdbInstance extends Dexie {
  recipes!: Table<IdbData<Recipe>>;
  recipeCollections!: Table<IdbData<RecipeCollection>>;
  mealPlans!: Table<IdbData<MealPlan>>;

  constructor() {
    super('langusta');
    this.version(1).stores({
      recipes: SYNCHRONIZABLE_TABLE,
      recipeCollections: SYNCHRONIZABLE_TABLE,
      mealPlan: SYNCHRONIZABLE_TABLE,
    });
  }

  async clear() {
    await Promise.all(this.tables.map((table) => table.clear()));
  }
}

export const idb = new IdbInstance();
