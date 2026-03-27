import { Timestamp } from 'firebase/firestore';

export interface Review {
  id: string;
  target_type: 'recipe' | 'restaurant' | 'menu_item';
  target_id: string;
  restaurant_id?: string;        // ef menu_item
  author_uid: string;
  author_name: string;
  author_avatar?: string;
  rating: number;                // 1-5
  comment_is?: string;
  comment_en?: string;
  image_urls?: string[];
  likes_count: number;
  created_at: Timestamp;
}
