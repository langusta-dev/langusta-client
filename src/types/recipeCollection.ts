import type { Editable, PublishableData } from './dataSync';
import type { Uuid } from './uuid';

export interface RecipeCollection extends PublishableData {
  title: string;
  recipeIds: Uuid[];
}

export type EditableRecipeCollection = Editable<RecipeCollection>;
