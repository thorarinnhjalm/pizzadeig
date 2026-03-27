export interface Category {
  id: string;
  type: 'deig' | 'sosa' | 'ostur' | 'alegg' | 'tol';
  name_is: string;
  name_en: string;
  slug: string;
  icon: string;                  // emoji
  description_is?: string;
  description_en?: string;
  sort_order: number;
}
