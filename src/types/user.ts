import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;                   // Firebase Auth UID
  display_name: string;
  email: string;
  avatar_url?: string;
  bio_is?: string;
  bio_en?: string;
  recipes_count: number;
  reviews_count: number;
  followers_count: number;
  following_count: number;
  role: 'user' | 'admin';
  joined_at: Timestamp;
}

export interface Like {
  id: string;                    // `${uid}_${target_type}_${target_id}`
  user_uid: string;
  target_type: 'recipe' | 'review';
  target_id: string;
  created_at: Timestamp;
}

export interface Follow {
  id: string;                    // `${follower}_${following}`
  follower_uid: string;
  following_uid: string;
  created_at: Timestamp;
}
