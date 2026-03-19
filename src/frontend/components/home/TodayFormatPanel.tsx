import { Calendar } from 'lucide-react';
import { Badge } from '../ui/badge';
import type { Format } from '@shared/types';

interface TodayFormatPanelProps {
  formats: Format[];
  currentFormatSlug: string | null;
}

export default function TodayFormatPanel({ formats, currentFormatSlug }: TodayFormatPanelProps) {
  return (
    <section className="glass-panel p-4 flex flex-col w-full h-full">
      <div className="flex items-center gap-2 shrink-0 mb-3">
        <Calendar className="w-5 h-5 text-primary" />
        <div>
          <p className="hud-label">Формат стрима</p>
          <h3 className="font-heading font-semibold text-text-primary">Today's Format</h3>
        </div>
      </div>

      <div className="flex-1 min-h-0 themed-scroll pr-1 space-y-2">
        {formats.map((format) => {
          const isCurrent = format.slug === currentFormatSlug;
          return (
            <div
              key={format.id}
              className={`flex items-start gap-3 py-2 px-2 rounded-lg transition-colors ${
                isCurrent ? 'bg-primary-dim/20 border border-primary/10' : ''
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isCurrent ? 'bg-primary' : 'bg-text-muted'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-heading font-medium ${isCurrent ? 'text-primary' : 'text-text-primary'}`}>
                    {format.title}
                  </p>
                  {isCurrent && <Badge variant="default" className="text-[9px]">Сейчас</Badge>}
                </div>
                {format.description && (
                  <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">{format.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
