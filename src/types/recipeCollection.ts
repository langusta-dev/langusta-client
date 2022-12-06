import type { Editable, SynchronizableData } from './dataSync';
import type { Uuid } from './uuid';

export interface RecipeCollection extends SynchronizableData {
  title: string;
  description?: string;
  author?: string;
  recipeIds: Uuid[];
}

export type EditableRecipeCollection = Editable<RecipeCollection>;
