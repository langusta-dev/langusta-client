import type { Editable, SynchronizableData } from './dataSync';
import type { Uuid } from './uuid';

export interface RecipeCollection extends SynchronizableData {
  name: string;
  recipeIds: Uuid[];
}

export type EditableRecipeCollection = Editable<RecipeCollection>;
