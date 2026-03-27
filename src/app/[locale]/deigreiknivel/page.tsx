'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Calculator, Plus, Minus, Info, Droplets, Wheat, Pizza } from 'lucide-react';

export default function DeigreiknivelPage() {
  const locale = useLocale() as 'is' | 'en';
  const isIs = locale === 'is';

  // State for calculation
  const [balls, setBalls] = useState(4);
  const [weight, setWeight] = useState(250); // grams per ball
  const [hydration, setHydration] = useState(65); // %
  const [salt, setSalt] = useState(2.8); // %
  const [yeast, setYeast] = useState(0.2); // % IDY
  const [oil, setOil] = useState(0); // %

  // Calculations
  const totalWeight = balls * weight;
  const bakerPercentageTotal = 100 + hydration + salt + yeast + oil;
  
  const flour = totalWeight / (bakerPercentageTotal / 100);
  const water = flour * (hydration / 100);
  const calculatedSalt = flour * (salt / 100);
  const calculatedYeast = flour * (yeast / 100);
  const calculatedOil = flour * (oil / 100);

  const formatWeight = (num: number) => {
    if (num < 10) return num.toFixed(2);
    if (num < 50) return num.toFixed(1);
    return Math.round(num).toString();
  };

  const PresetButton = ({ label, h, s, o, y }: { label: string, h: number, s: number, o: number, y: number }) => (
    <button 
      onClick={() => {
        setHydration(h);
        setSalt(s);
        setOil(o);
        setYeast(y);
      }}
      className="px-4 py-2 text-sm font-semibold rounded-full border border-(--color-border) bg-white text-(--color-text-primary) hover:border-(--color-brand) hover:text-(--color-brand) transition-colors"
    >
      {label}
    </button>
  );

  return (
    <main className="flex-1 w-full bg-background min-h-screen pb-20">
      {/* Header */}
      <div className="bg-(--color-bg-secondary) border-b border-(--color-border-light) pt-16 pb-12 mb-8 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <div className="w-16 h-16 bg-white border border-(--color-border) shadow-md rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-3 hover:rotate-0 transition-transform">
            <Calculator className="w-8 h-8 text-(--color-brand)" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-(--color-text-primary) mb-4 drop-shadow-sm">
            {isIs ? 'Nákvæma Deigreiknivélin' : 'Precision Dough Calculator'}
          </h1>
          <p className="text-lg text-(--color-text-secondary) max-w-2xl mx-auto italic">
            {isIs 
              ? 'Byggt á formúlum (Baker\'s Percentage) bakara. Sláðu inn stærð og fjölda pizzabotna til að fá nákvæm hlutföll fyrir fullkomna gerjun.'
              : 'Built on strict Baker\'s Percentages. Enter your desired dough ball count and specs to generate the perfect recipe.'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Controls */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white border border-(--color-border) rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Pizza className="w-5 h-5 text-(--color-brand)" />
                  {isIs ? 'Stærð og Fjöldi' : 'Size and Quantity'}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Balls */}
                <div>
                  <label className="text-sm font-bold text-(--color-text-secondary) uppercase tracking-wider mb-3 block">
                    {isIs ? 'Fjöldi Pizzabotna' : 'Number of Pizzas'}
                  </label>
                  <div className="flex items-center bg-(--color-bg-secondary) rounded-2xl p-2 border border-(--color-border-light)">
                    <button onClick={() => setBalls(Math.max(1, balls - 1))} className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm hover:text-(--color-brand) transition-colors">
                      <Minus className="w-5 h-5" />
                    </button>
                    <div className="flex-1 text-center font-display text-2xl font-bold">{balls}</div>
                    <button onClick={() => setBalls(balls + 1)} className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm hover:text-(--color-brand) transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Weight */}
                <div>
                  <label className="text-sm font-bold text-(--color-text-secondary) uppercase tracking-wider mb-3 block flex justify-between">
                    <span>{isIs ? 'Þyngd pr. botn' : 'Weight per pizza'}</span>
                    <span className="text-(--color-brand)">{weight}g</span>
                  </label>
                  <input 
                    type="range" 
                    min="150" max="400" step="10" 
                    value={weight} 
                    onChange={e => setWeight(Number(e.target.value))}
                    className="w-full accent-(--color-brand) h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>150g (Pan)</span>
                    <span>250g (Napoli)</span>
                    <span>400g (NY)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-(--color-border) rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Wheat className="w-5 h-5 text-amber-500" />
                  {isIs ? 'Bakarahlutföll (Baker\'s %)' : 'Baker\'s Percentages'}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                <PresetButton label="Napoli (Klassísk)" h={65} s={2.8} o={0} y={0.2} />
                <PresetButton label="Al Taglio (Skúffu)" h={80} s={2.5} o={2.0} y={0.5} />
                <PresetButton label="New York Style" h={60} s={2.5} o={1.5} y={0.4} />
              </div>

              <div className="space-y-8">
                {/* Hydration */}
                <div>
                  <label className="text-sm font-bold text-(--color-text-secondary) uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2"><Droplets className="w-4 h-4 text-blue-500"/> {isIs ? 'Vatn (Hydration)' : 'Water (Hydration)'}</span>
                    <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold">{hydration}%</span>
                  </label>
                  <input 
                    type="range" 
                    min="50" max="90" step="1" 
                    value={hydration} 
                    onChange={e => setHydration(Number(e.target.value))}
                    className="w-full accent-blue-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Salt */}
                <div>
                  <label className="text-sm font-bold text-(--color-text-secondary) uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>{isIs ? 'Salt' : 'Salt'}</span>
                    <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-bold">{salt}%</span>
                  </label>
                  <input 
                    type="range" 
                    min="1.0" max="4.0" step="0.1" 
                    value={salt} 
                    onChange={e => setSalt(Number(e.target.value))}
                    className="w-full accent-slate-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Yeast */}
                <div>
                  <label className="text-sm font-bold text-(--color-text-secondary) uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>{isIs ? 'Þurrger' : 'Dry Yeast'}</span>
                    <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">{yeast.toFixed(2)}%</span>
                  </label>
                  <input 
                    type="range" 
                    min="0.01" max="1.5" step="0.01" 
                    value={yeast} 
                    onChange={e => setYeast(Number(e.target.value))}
                    className="w-full accent-amber-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-2 italic flex items-center gap-1">
                    <Info className="w-3 h-3"/> {isIs ? 'Fyrir ferskt ger, margfaldaðu með 3.' : 'For fresh yeast, multiply by 3.'}
                  </p>
                </div>

                {/* Oil */}
                <div>
                  <label className="text-sm font-bold text-(--color-text-secondary) uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>{isIs ? 'Ólífuolía' : 'Olive Oil'}</span>
                    <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded font-bold">{oil.toFixed(1)}%</span>
                  </label>
                  <input 
                    type="range" 
                    min="0" max="5.0" step="0.5" 
                    value={oil} 
                    onChange={e => setOil(Number(e.target.value))}
                    className="w-full accent-green-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div className="lg:col-span-5 relative">
            <div className="bg-(--color-bg-secondary) rounded-3xl p-6 md:p-8 border border-(--color-border) shadow-xl sticky top-24">
              <h2 className="text-2xl font-display font-bold text-(--color-brand) mb-6 pb-4 border-b border-(--color-border-light)">
                {isIs ? 'Uppskriftin Þín' : 'Your Recipe'}
              </h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-gray-200/50">
                  <span className="font-semibold flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-300"></div> {isIs ? 'Hveiti (100%)' : 'Flour (100%)'}</span>
                  <span className="text-xl font-bold">{formatWeight(flour)} <span className="text-sm font-normal text-muted-foreground">g</span></span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200/50">
                  <span className="font-semibold flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></div> {isIs ? 'Vatn' : 'Water'}</span>
                  <span className="text-xl font-bold">{formatWeight(water)} <span className="text-sm font-normal text-muted-foreground">g</span></span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200/50">
                  <span className="font-semibold flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-100 border border-slate-300"></div> {isIs ? 'Salt' : 'Salt'}</span>
                  <span className="text-xl font-bold">{formatWeight(calculatedSalt)} <span className="text-sm font-normal text-muted-foreground">g</span></span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200/50">
                  <span className="font-semibold flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-800 border border-amber-900"></div> {isIs ? 'Þurrger' : 'Dry Yeast'}</span>
                  <span className="text-xl font-bold">{formatWeight(calculatedYeast)} <span className="text-sm font-normal text-muted-foreground">g</span></span>
                </div>
                {oil > 0 && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-200/50">
                    <span className="font-semibold flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-100 border border-green-300"></div> {isIs ? 'Ólífuolía' : 'Olive Oil'}</span>
                    <span className="text-xl font-bold">{formatWeight(calculatedOil)} <span className="text-sm font-normal text-muted-foreground">g</span></span>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl p-5 border border-(--color-border-light) text-center">
                <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-1">
                  {isIs ? 'Heildarþyngd' : 'Total Dough Weight'}
                </p>
                <div className="text-4xl font-display font-extrabold text-(--color-text-primary)">
                  {Math.round(totalWeight)}<span className="text-xl text-muted-foreground">g</span>
                </div>
                <p className="mt-2 text-sm text-(--color-text-secondary)">
                  = {balls} x {weight}g {isIs ? 'botnar' : 'balls'}
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
