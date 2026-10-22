import { GeoPoint, Timestamp } from 'firebase/firestore';

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description_is: string;
  description_en: string;
  address: string;
  city: string;
  postal_code: string;
  location: GeoPoint;
  phone?: string;
  website?: string;
  opening_hours: Record<string, string>;
  // Optional remark shown under the opening hours (e.g. the hours are Wolt delivery times)
  opening_hours_note_is?: string;
  opening_hours_note_en?: string;
  price_level: 1 | 2 | 3 | 4;
  features: string[];
  image_urls: string[];
  owner_uid?: string;
  // Pizzadeig.is community rating
  rating_avg: number;
  rating_count: number;
  // External ratings
  rating_google?: number;
  rating_tripadvisor?: number;
  google_place_id?: string;
  tripadvisor_url?: string;
  likes_count: number;
  is_verified: boolean;
  is_seeded?: boolean;
  tags: string[];
  // Chains: one page for the whole chain, with its locations listed (see seo/matsedlar/2026-10-22-lota2/json/dominos.json)
  branches?: RestaurantBranch[];
  // Where the menu and prices come from (see seo/matsedlar/)
  menu_source_url?: string;
  menu_source_label?: string;
  menu_verified_at?: string; // ISO date, e.g. '2026-10-22'
  menu_price_basis?: 'in_house' | 'delivery_platform' | 'mixed' | 'owner_supplied' | 'none';
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface RestaurantBranch {
  name: string;
  address: string;
  postal_code?: string;
  city: string;
  phone?: string;
  opening_hours_note?: string; // Icelandic
  opening_hours_note_en?: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  name_is: string;
  name_en: string;
  description_is?: string;
  description_en?: string;
  price: number;
  price_large?: number;
  size_small_label?: string;
  size_large_label?: string;
  category: string;
  image_url?: string;
  sort_order: number;
  rating_avg?: number;
  rating_count?: number;
}
