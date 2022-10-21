import type { DateString } from './basic';
import type { Uuid } from './uuid';

export type RecipeId = Uuid;

export enum RecipeMealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  APPETIZER = 'APPETIZER',
  DESSERT = 'DESSERT',
}

export enum RecipeIngredientQuantityUnit {
  /**
   * gram
   */
  G = 'G',

  /**
   * kilogram
   */
  KG = 'KG',

  /**
   * liter
   */
  L = 'L',

  /**
   * milliliter
   */
  ML = 'ML',

  /**
   * 1 glass -> 200 ml
   */
  GLASS = 'GLASS',

  /**
   * 1 spoon -> 15 g
   * 1 spoon -> 15 ml
   */
  SPOON = 'SPOON',

  /**
   * 1 teaspoon -> 5 g
   * 1 teaspoon -> 5 ml
   */
  TEASPOON = 'TEASPOON',
}

export interface RecipeIngredient {
  quantity: number;
  quantityUnit: RecipeIngredientQuantityUnit;
}

export enum RecipePreparationTimeUnit {
  HOUR = 'HOUR',
  MINUTE = 'MINUTE',
}

export interface RecipePreparationTime {
  value: number;
  unit: RecipePreparationTimeUnit;
}

export interface RecipeStep {
  description: string;
}

export interface Recipe {
  id: RecipeId;
  title: string;
  description: string;
  author: string;
  externalSourceUrl: string;
  likeCount: number;
  rating: number;
  createdAt: DateString;
  updatedAt: DateString;
  calorieCount: number;
  mealType: RecipeMealType;
  ingredients: RecipeIngredient[];
  preparationTime: RecipePreparationTime;
  steps: RecipeStep[];
}
