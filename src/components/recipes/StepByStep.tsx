import { Recipe } from '@/types/recipe';

interface Props {
  recipe: Recipe;
  locale: 'is' | 'en';
}

export function StepByStep({ recipe, locale }: Props) {
  const steps = locale === 'is' ? recipe.steps_is : recipe.steps_en;

  if (!steps || steps.length === 0) return null;

  return (
    <div className="mt-12 bg-(--color-bg-secondary) rounded-2xl shadow-sm border border-(--color-border) p-6 md:p-10">
      <h3 className="text-3xl font-extrabold text-(--color-text-primary) mb-10 text-center relative inline-block heading-display">
        {locale === 'is' ? 'Aðferð' : 'Instructions'}
        <span className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-ring rounded-full"></span>
      </h3>
      <div className="space-y-0">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-6 group relative">
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="w-12 h-12 bg-(--color-bg-secondary) rounded-full flex items-center justify-center font-bold text-xl text-(--color-brand) border-2 border-(--color-brand) shadow-sm group-hover:bg-(--color-brand) group-hover:text-white transition-all duration-300 transform group-hover:scale-110 z-10 heading-display">
                {i + 1}
              </div>
              {i !== steps.length - 1 && (
                <div className="w-0.5 h-full bg-gray-200 mt-2 mb-2 group-hover:bg-(--color-brand)/40 transition-colors" />
              )}
            </div>
            <div className="pt-2 pb-10">
              <p className="text-lg text-(--color-text-secondary) leading-relaxed group-hover:text-(--color-text-primary) transition-colors">
                {step}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
