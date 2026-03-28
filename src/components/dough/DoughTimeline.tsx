import { TimelineStep } from '@/lib/doughCalculator';
import { format } from 'date-fns';
import { is, enUS } from 'date-fns/locale';

interface Props {
  timeline: TimelineStep[];
  locale: 'is' | 'en';
}

export function DoughTimeline({ timeline, locale }: Props) {
  const dateLocale = locale === 'is' ? is : enUS;

  return (
    <div className="bg-chalk w-full relative">
      <h3 className="font-chalk text-(--color-text-chalk) text-3xl mb-8 border-b border-white/10 pb-4">{locale === 'is' ? 'Tímalínan Þín' : 'Your Timeline'}</h3>
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-white/20">
        {timeline.map((step, idx) => {
          return (
            <div key={idx} className={`relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-(--color-gold) bg-(--color-bg-warm) text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-lg">
                {step.icon}
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 backdrop-blur-sm p-5 rounded-lg border border-white/10 shadow-lg hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-(--color-gold-light) capitalize">{format(step.datetime, 'EEEE HH:mm', { locale: dateLocale })}</span>
                  {step.notify && <span className="text-[10px] uppercase tracking-widest text-[#E8E0D4]/70 bg-white/10 px-2 py-0.5 rounded shadow-sm">{locale === 'is' ? 'Tilkynning' : 'Notify'}</span>}
                </div>
                <h4 className="font-bold text-(--color-text-chalk) text-xl mb-2">{locale === 'is' ? step.title_is : step.title_en}</h4>
                <p className="text-(--color-text-tertiary) text-sm font-body">{locale === 'is' ? step.description_is : step.description_en}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
