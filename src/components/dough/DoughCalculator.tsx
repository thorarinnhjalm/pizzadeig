'use client';

import { useState, useEffect } from 'react';
import { calculateDough, DoughResult } from '@/lib/doughCalculator';
import { DoughTimeline } from './DoughTimeline';
import { ShoppingList } from './ShoppingList';
import { MethodBadge } from './MethodBadge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
  locale: 'is' | 'en';
}

export function DoughCalculator({ locale }: Props) {
  const [numPizzas, setNumPizzas] = useState(4);
  const [ballWeight, setBallWeight] = useState<220 | 260>(260);
  
  const [bakeDate, setBakeDate] = useState('');
  const [bakeTime, setBakeTime] = useState('18:00');
  
  useEffect(() => {
    // Setting initial date in useEffect to avoid hydration mismatch
    // Using requestAnimationFrame to avoid "set-state-in-effect" warning
    const frame = requestAnimationFrame(() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];
      if (!bakeDate) {
        setBakeDate(dateStr);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [bakeDate]);

  const bakeDateTime = new Date(`${bakeDate}T${bakeTime}`);
  
  // Safely fallback if date is invalid during hydration
  const isValidDate = !isNaN(bakeDateTime.getTime());
  const safeDate = isValidDate ? bakeDateTime : new Date();

  const result: DoughResult = calculateDough({ numPizzas, ballWeight, bakeDateTime: safeDate });

  return (
    <div className="space-y-10">
      <div className="bg-secondary border border-border p-6 md:p-10 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Subtle wood noise overlay on the card */}
        <div className="absolute inset-0 bg-wood opacity-30 pointer-events-none mix-blend-overlay"></div>
        
        <div className="relative z-10">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-8 text-foreground border-b border-border/50 pb-4">
            {locale === 'is' ? 'Hvenær stefnirðu á að borða?' : 'When are you planning to eat?'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <Label className="text-muted-foreground font-body text-lg">{locale === 'is' ? 'Dagsetning' : 'Date'}</Label>
              <Input type="date" value={bakeDate} onChange={e => setBakeDate(e.target.value)} className="bg-muted border-primary text-foreground text-lg h-14" min={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="space-y-4">
              <Label className="text-muted-foreground font-body text-lg">{locale === 'is' ? 'Klukkan hvað?' : 'Time'}</Label>
              <Input type="time" value={bakeTime} onChange={e => setBakeTime(e.target.value)} className="bg-muted border-primary text-foreground text-lg h-14" />
            </div>
          </div>

          <h2 className="font-display font-bold text-3xl md:text-4xl mb-8 text-foreground border-b border-border/50 pb-4">
            {locale === 'is' ? 'Uppskriftin þín' : 'Your Recipe'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
            <div className="space-y-4">
              <Label className="text-muted-foreground font-body text-lg">{locale === 'is' ? 'Hversu margar pizzur?' : 'How many pizzas?'}</Label>
              <div className="flex items-center gap-6">
                <Button type="button" variant="outline" className="w-14 h-14 rounded-full border-2 border-primary text-primary hover:bg-muted text-2xl" onClick={() => setNumPizzas(Math.max(1, numPizzas - 1))}>-</Button>
                <span className="font-chalk text-5xl text-foreground w-16 text-center">{numPizzas}</span>
                <Button type="button" variant="outline" className="w-14 h-14 rounded-full border-2 border-primary text-primary hover:bg-muted text-2xl" onClick={() => setNumPizzas(numPizzas + 1)}>+</Button>
              </div>
            </div>
            <div className="space-y-4">
               <Label className="text-muted-foreground mb-4 block font-body text-lg">{locale === 'is' ? 'Stærð deigkúlu' : 'Dough ball weight'}</Label>
                <div className="space-y-4">
                  <label className="flex items-center space-x-4 bg-muted p-4 rounded-xl border border-border/50 relative cursor-pointer hover:border-primary transition-colors">
                    <input type="radio" name="ballWeight" value="220" checked={ballWeight === 220} onChange={(e) => setBallWeight(parseInt(e.target.value) as 220|260)} className="accent-primary w-6 h-6 ml-1 cursor-pointer" />
                    <span className="text-foreground font-body text-lg select-none">220g — 10&quot; pizza <span className="text-muted-foreground text-sm ml-2">(Hefðbundin)</span></span>
                  </label>
                  <label className="flex items-center space-x-4 bg-muted p-4 rounded-xl border border-border/50 relative cursor-pointer hover:border-primary transition-colors">
                    <input type="radio" name="ballWeight" value="260" checked={ballWeight === 260} onChange={(e) => setBallWeight(parseInt(e.target.value) as 220|260)} className="accent-primary w-6 h-6 ml-1 cursor-pointer" />
                    <span className="text-foreground font-body text-lg select-none">260g — 12&quot; pizza <span className="text-muted-foreground text-sm ml-2">(Stór)</span></span>
                  </label>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="divider-ornament">
         <span className="text-3xl">🍕</span>
      </div>

      {isValidDate && (
         <div className="fade-up visible">
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
               <h2 className="font-display font-bold text-4xl text-foreground">{locale === 'is' ? 'Innkaup & Aðferð' : 'Ingredients & Method'}</h2>
               <div className="hidden md:block flex-1 h-px bg-border/50 ml-4"></div>
               <MethodBadge method={result.method} locale={locale} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
               <div className="lg:col-span-4 space-y-12">
                  <div className="sticky top-24">
                     <ShoppingList list={result.shoppingList} locale={locale} />
                     <div className="bg-muted border border-border/50 p-8 rounded-2xl shadow-sm mt-8 relative overflow-hidden">
                        <div className="absolute -right-6 -top-6 text-9xl opacity-5">🔔</div>
                        <h3 className="font-display font-bold text-2xl text-foreground mb-4">{locale === 'is' ? 'Tilkynningar' : 'Notifications'}</h3>
                        <p className="text-muted-foreground font-body mb-6 leading-relaxed">
                           {locale === 'is' 
                           ? 'Fáðu áminningar í síma eða tölvupósti þegar tími er kominn á næsta skref, t.d. að hefa eða hita ofninn.' 
                           : 'Get reminders when it is time for the next step, e.g proofing or baking.'}
                        </p>
                        <Button className="btn-primary w-full shadow-lg hover:shadow-xl">{locale === 'is' ? 'Virkja (Koma Bráðum)' : 'Enable (Coming Soon)'}</Button>
                     </div>
                  </div>
               </div>
               <div className="lg:col-span-8 w-full">
                  <DoughTimeline timeline={result.timeline} locale={locale} />
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
