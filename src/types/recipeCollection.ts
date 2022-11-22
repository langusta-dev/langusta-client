import type { SynchronizableData } from './dataSync';
import type { Uuid } from './uuid';

export interface RecipeCollection extends SynchronizableData {
  name: string;
  recipeIds: Uuid[];
}
