import { DoughMethod } from '@/lib/doughCalculator';
import { Snowflake, Zap } from 'lucide-react';

interface Props {
  method: DoughMethod;
  locale: 'is' | 'en';
}

export function MethodBadge({ method, locale }: Props) {
  const isCold = method.type === 'kaldhefun';
  
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold uppercase tracking-widest text-sm shadow-sm ${
      isCold ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
    }`}>
      {isCold ? <Snowflake className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
      {locale === 'is' ? method.label_is : method.label_en}
    </div>
  );
}
