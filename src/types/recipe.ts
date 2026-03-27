import type { Timestamp } from 'firebase/firestore';

export type RecipeType = 'deig' | 'sosa' | 'ostur' | 'alegg' | 'tol' | 'heildar';
export type Difficulty = 'audvelt' | 'midlungs' | 'erfitt';

export interface Ingredient {
  amount: string;
  unit: string;
  name: string;
}

export interface Recipe {
  id: string;                    // auto
  title_is: string;
  title_en: string;
  slug: string;                  // URL-safe
  description_is: string;
  description_en: string;
  type: RecipeType;
  category: string;              // undirflokkur
  difficulty: Difficulty;
  prep_time_min: number;
  cook_time_min: number;
  rest_time_min: number;
  servings: number;
  ingredients_is: Ingredient[];
  ingredients_en: Ingredient[];
  steps_is: string[];
  steps_en: string[];
  tips_is?: string;
  tips_en?: string;
  image_urls: string[];          // Cloud Storage
  video_url?: string;            // YouTube
  author_uid: string;
  author_name: string;
  author_avatar?: string;
  likes_count: number;           // denormalized
  rating_avg: number;
  rating_count: number;
  tags: string[];
  published: boolean;
  seo_title_is?: string;
  seo_description_is?: string;
  seo_title_en?: string;
  seo_description_en?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}
