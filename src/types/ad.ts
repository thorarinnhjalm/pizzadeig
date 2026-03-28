import { Timestamp } from 'firebase/firestore';

export type AdFormat = '1018x360' | '1080x240' | '300x250' | '310x400' | '320x50' | '468x60' | 'sponsored_card';
export type AdStatus = 'active' | 'paused' | 'ended';

export interface Ad {
  id: string;
  name: string;
  client: string;
  format: AdFormat;
  creatives?: {
    '1018x360'?: string;
    '1080x240'?: string;
    '300x250'?: string;
    '310x400'?: string;
    '320x50'?: string;
    '468x60'?: string;
  };
  image_url?: string;
  target_url: string;
  status: AdStatus;
  start_date: Timestamp;
  end_date: Timestamp;
  placements: string[];          // e.g. ['home_hero', 'recipes_sidebar']
  budget_limit?: number;         // ISK
  created_at?: Timestamp;
  updated_at?: Timestamp;
  impressions?: number;
  clicks?: number;
  is_seeded?: boolean;
}

export interface AdEvent {
  id?: string;                   // auto if generated
  ad_id: string;
  type: 'impression' | 'click';
  placement: string;
  timestamp: Timestamp | ReturnType<typeof import('firebase/firestore').serverTimestamp>;    // serverTimestamp compatibility
  session_id: string;            // Anonymized hash hash to prevent fraud
}

export interface AdDailyStat {
  id: string;                    // `${ad_id}_YYYY_MM_DD`
  ad_id: string;
  date: string;                  // 'YYYY-MM-DD'
  impressions: number;
  clicks: number;
  cost: number;
}
