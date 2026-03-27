import Image from 'next/image';
import { Flame, Clock, Pizza } from 'lucide-react';
import { Recipe } from '@/types/recipe';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/routing';

interface RecipeCardProps {
  recipe: Recipe;
  locale: 'is' | 'en';
}

export function RecipeCard({ recipe, locale }: RecipeCardProps) {
  const title = locale === 'is' ? recipe.title_is : recipe.title_en;
  const description = locale === 'is' ? recipe.description_is : recipe.description_en;
  const totalTime = recipe.prep_time_min + recipe.cook_time_min + recipe.rest_time_min;
  
  // Format totalTime (if > 60m show hours)
  const formatTime = (minutes: number) => {
    if (minutes >= 60) {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return m > 0 ? `${h}h ${m}m` : `${h}h`;
    }
    return `${minutes}m`;
  };

  return (
    <Link href={`/uppskriftir/${recipe.slug}`} className="group block h-full">
      <Card className="h-full border-[var(--color-border)] border-b-[3px] border-b-[var(--color-gold)] hover:border-b-[var(--color-brand)] card-hover flex flex-col bg-[var(--color-bg-secondary)] overflow-hidden transition-all duration-300">
        <div className="relative w-full aspect-[16/10] bg-[var(--color-bg-primary)] overflow-hidden">
          {recipe.image_urls?.[0] ? (
            <Image 
              src={recipe.image_urls[0]} 
              alt={title || 'Recipe Image'} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-500 saturate-[1.1] brightness-95"
            />
          ) : (
            <div className="absolute inset-0 skeleton" />
          )}
          <div className="absolute top-3 right-3 bg-[var(--color-bg-primary)]/80 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-[var(--color-text-primary)] flex items-center shadow-sm">
            <Pizza className="w-3 h-3 text-[var(--color-gold)] mr-1 fill-current" />
            {recipe.rating_avg > 0 ? recipe.rating_avg.toFixed(1) : (locale === 'is' ? 'Ný' : 'New')}
          </div>
        </div>
        
        <CardContent className="p-5 flex flex-col flex-1 relative pt-6">
          <Badge className="absolute -top-3 left-5 bg-[var(--color-terracotta)] text-[var(--color-text-primary)] hover:bg-[var(--color-terracotta)] font-chalk text-[0.95rem] tracking-wide px-3 py-1 shadow-sm border-none">
            {recipe.category || recipe.type}
          </Badge>
          <h3 className="font-display font-bold text-xl mb-2 text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)] transition-colors line-clamp-2">{title}</h3>
          <p className="text-[var(--color-text-secondary)] text-sm mb-4 line-clamp-2 font-body">{description}</p>
          
          <div className="mt-auto flex items-center justify-between text-[11px] text-[var(--color-text-tertiary)] uppercase tracking-wider font-bold pt-4 border-t border-[var(--color-border)]">
            <span className="flex items-center">
              <Flame className="w-3.5 h-3.5 mr-1 text-[var(--color-brand)]" /> 
              {recipe.difficulty === 'audvelt' ? (locale === 'is' ? 'Auðvelt' : 'Easy') : 
               recipe.difficulty === 'midlungs' ? (locale === 'is' ? 'Miðlungs' : 'Medium') : 
               (locale === 'is' ? 'Erfitt' : 'Hard')}
            </span>
            <span className="flex items-center text-[var(--color-text-secondary)] font-medium bg-[var(--color-bg-tertiary)] px-2 py-1 rounded">
              <Clock className="w-3.5 h-3.5 mr-1 text-[var(--color-gold)]" /> {formatTime(totalTime)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
