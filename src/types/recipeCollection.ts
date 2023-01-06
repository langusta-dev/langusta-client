import type { Editable, PublishableData, Published } from './dataSync';
import type { Uuid } from './uuid';

export interface RecipeCollection extends PublishableData {
  title: string;
  recipeIds: Uuid[];
}

export type EditableRecipeCollection = Editable<RecipeCollection>;

export type PublishedRecipeCollection = Published<RecipeCollection>;

export interface RecipeCollectionQuery {
  search?: string;
}
