import type { Editable, SynchronizableData } from './dataSync';

export enum RecipeMealType {
  Breakfast = 'BREAKFAST',
  Lunch = 'LUNCH',
  Appetizer = 'APPETIZER',
  Dinner = 'DINNER',
  Dessert = 'DESSERT',
  Snack = 'SNACK',
}

export enum RecipeIngredientQuantityUnit {
  /**
   * gram
   */
  G = 'G',

  /**
   * kilogram
   */
  Kg = 'KG',

  /**
   * liter
   */
  L = 'L',

  /**
   * milliliter
   */
  Ml = 'ML',

  /**
   * 1 glass -> 200 ml
   */
  Glass = 'GLASS',

  /**
   * 1 spoon -> 15 g
   * 1 spoon -> 15 ml
   */
  Spoon = 'SPOON',

  /**
   * 1 teaspoon -> 5 g
   * 1 teaspoon -> 5 ml
   */
  Teaspoon = 'TEASPOON',
}

export interface RecipeIngredient {
  name: string;
  quantity: number;
  quantityUnit: RecipeIngredientQuantityUnit;
}

export enum RecipePreparationTimeUnit {
  Hour = 'HOUR',
  Minute = 'MINUTE',
}

export interface RecipePreparationTime {
  value: number;
  unit: RecipePreparationTimeUnit;
}

export interface RecipeStep {
  description: string;
}

export interface Recipe extends SynchronizableData {
  title: string;
  description: string;
  author?: string;
  isPublic?: boolean;
  externalSourceUrl?: string;
  likeCount?: number;
  rating?: number;
  calorieCount: number;
  mealType: RecipeMealType;
  ingredients: RecipeIngredient[];
  preparationTime: RecipePreparationTime;
  steps: RecipeStep[];
}

export type EditableRecipe = Editable<Recipe>;
