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
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  name_is: string;
  name_en: string;
  description_is?: string;
  description_en?: string;
  price: number;
  category: string;
  image_url?: string;
  sort_order: number;
  rating_avg?: number;
  rating_count?: number;
}
