'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Volume2, VolumeX, Check } from 'lucide-react';
import { Recipe } from '@/types/recipe';
import { Button } from '@/components/ui/button';

interface Props {
  recipe: Recipe;
  locale: 'is' | 'en';
  onClose: () => void;
}

export function GuidedBake({ recipe, locale, onClose }: Props) {
  const steps = locale === 'is' ? recipe.steps_is : recipe.steps_en;
  const [currentStep, setCurrentStep] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Estimate time per step: divide total time evenly, min 60s
  const totalMinutes = recipe.prep_time_min + recipe.cook_time_min + (recipe.rest_time_min || 0);
  const minutesPerStep = Math.max(1, Math.round(totalMinutes / steps.length));

  const resetTimer = useCallback(() => {
    setTimerSeconds(minutesPerStep * 60);
    setIsTimerRunning(false);
  }, [minutesPerStep]);

  useEffect(() => {
    resetTimer();
  }, [currentStep, resetTimer]);

  // Timer countdown
  useEffect(() => {
    if (!isTimerRunning || timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          // Play sound
          if (soundEnabled) {
            try {
              const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdG+Bk42NeXJ5e3uFjouAeHN0d3+Ii4V/eHZ3foaKiIJ7eHl7g4mJhX55eHl/homHgnt5eXuDiYmEfnl4eoGHiYaAe3l5fISJiIN9eXl7goiIhH95eXqCh4iFgHp5enqEh4iFf3t5e3uFh4eEfnt6fH6Gh4aDfnt6fH+Gh4WCfnt7fYCGhoSDfnx7fYGFhYSDf3x8foKFhYOCf3x8f4KFhIKBf3x9f4OEhIGBf319gIOEg4GAgH1+gYODg4CAgH5/gYODgoCAf35/gYKCgoCAf39/gYKCgYB/f39/gIGBgIB/f39/gIGBgIB/f39/gIGBgIB/f39/gIGBgIB/f3+AgICAgIB/f3+AgICAgIB/f3+AgICAgH9/f3+AgICAgH9/f3+AgICAgH9/f3+AgICAgH9/f3+AgICAgH9/f3+AgICAgH9/f3+AgICAgH9/f3+AgICA');
              audio.play().catch(() => {});
            } catch {}
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, soundEnabled]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const title = locale === 'is' ? recipe.title_is : recipe.title_en;

  const markComplete = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const isLastStep = currentStep === steps.length - 1;
  const allDone = completedSteps.size === steps.length;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0806] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-(--color-border)">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-muted-foreground hover:text-(--color-text-primary) transition-colors">
            <X className="w-6 h-6" />
          </button>
          <div>
            <p className="text-xs uppercase tracking-widest text-ring font-bold">
              {locale === 'is' ? 'Pizzuleiðsögn' : 'Guided Bake'}
            </p>
            <h2 className="text-lg font-display font-bold text-(--color-text-primary) truncate max-w-[200px] md:max-w-none">{title}</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-muted-foreground hover:text-(--color-text-primary)">
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <span className="text-sm font-bold text-(--color-text-secondary)">
            {currentStep + 1} / {steps.length}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-(--color-bg-tertiary)">
        <div className="h-full bg-gradient-to-r from-(--color-brand) to-(--color-gold) transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 md:py-16 overflow-y-auto">
        {allDone ? (
          /* Completion screen */
          <div className="text-center max-w-lg">
            <div className="text-8xl mb-8">🍕</div>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-ring mb-4">
              {locale === 'is' ? 'Til hamingju!' : 'Congratulations!'}
            </h2>
            <p className="text-xl text-(--color-text-secondary) font-body mb-8">
              {locale === 'is' ? 'Pizzan þín er tilbúin! Njóttu hennar 🎉' : 'Your pizza is ready! Enjoy! 🎉'}
            </p>
            <Button onClick={onClose} className="btn-primary h-14 px-12 text-lg">
              {locale === 'is' ? 'Loka' : 'Done'}
            </Button>
          </div>
        ) : (
          <>
            {/* Step number badge */}
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-(--color-brand) to-(--color-brand-dark) flex items-center justify-center text-white font-display font-bold text-3xl shadow-lg shadow-(--color-brand)/30 mb-8">
              {currentStep + 1}
            </div>

            {/* Step text */}
            <p className="text-2xl md:text-3xl text-center text-(--color-text-primary) font-body leading-relaxed max-w-2xl mb-12">
              {steps[currentStep]}
            </p>

            {/* Timer */}
            <div className="flex flex-col items-center gap-6 mb-12">
              <div className={`text-6xl md:text-7xl font-mono font-bold tracking-wider ${timerSeconds === 0 && !isTimerRunning ? 'text-ring animate-pulse' : 'text-(--color-text-primary)'}`}>
                {formatTime(timerSeconds)}
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="w-14 h-14 rounded-full bg-(--color-brand) hover:bg-[#b02e0b] text-white flex items-center justify-center shadow-lg transition-colors"
                >
                  {isTimerRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>
                <button
                  onClick={resetTimer}
                  className="w-12 h-12 rounded-full bg-(--color-bg-tertiary) hover:bg-(--color-bg-warm) text-(--color-text-secondary) flex items-center justify-center transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer navigation */}
      {!allDone && (
        <div className="p-4 md:p-6 border-t border-(--color-border) flex items-center justify-between">
          <button
            onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
            disabled={currentStep === 0}
            className="flex items-center gap-2 text-(--color-text-secondary) hover:text-(--color-text-primary) disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline font-bold">{locale === 'is' ? 'Fyrra' : 'Previous'}</span>
          </button>

          <Button onClick={markComplete} className="btn-primary h-12 px-8 gap-2 text-base">
            <Check className="w-5 h-5" />
            {isLastStep
              ? (locale === 'is' ? 'Ljúka bakstur' : 'Finish bake')
              : (locale === 'is' ? 'Næsta skref' : 'Next step')
            }
          </Button>

          <button
            onClick={() => currentStep < steps.length - 1 && setCurrentStep(currentStep + 1)}
            disabled={isLastStep}
            className="flex items-center gap-2 text-(--color-text-secondary) hover:text-(--color-text-primary) disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <span className="hidden sm:inline font-bold">{locale === 'is' ? 'Sleppa' : 'Skip'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Step dots */}
      {!allDone && (
        <div className="flex justify-center gap-2 pb-4">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentStep ? 'bg-(--color-brand) scale-125' :
                completedSteps.has(i) ? 'bg-ring' :
                'bg-(--color-bg-tertiary)'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
