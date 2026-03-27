'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';

interface Props {
  rating: number;
  max?: number;
  size?: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
}

export function RatingStars({ rating, max = 5, size = 20, onChange, readonly = false }: Props) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const isActive = (hoverRating !== null ? hoverRating : rating) >= starValue;
        
        return (
          <button
            key={i}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(starValue)}
            onMouseEnter={() => !readonly && setHoverRating(starValue)}
            onMouseLeave={() => !readonly && setHoverRating(null)}
            className={`transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-(--pizza-red) rounded-full ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-125'
            }`}
            aria-label={`${starValue} stjörnur`}
          >
            <Star
              className={`${isActive ? 'text-(--pizza-gold) fill-(--pizza-gold)' : 'text-gray-200 fill-gray-100'} transition-all`}
              style={{ width: size, height: size }}
            />
          </button>
        );
      })}
    </div>
  );
}
