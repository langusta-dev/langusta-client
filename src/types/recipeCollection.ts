import type { RecipeId } from './recipe';
import type { Uuid } from './uuid';

export type RecipeCollectionId = Uuid;

export interface RecipeCollection {
  id: RecipeCollectionId;
  name: string;
  recipeIds: RecipeId[];
}
