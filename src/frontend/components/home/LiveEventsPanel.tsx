import { Activity } from 'lucide-react';
import type { FeedEvent } from '@shared/types';

const iconByType: Record<string, string> = {
  status: '🔴',
  reward: '🎁',
  follow: '👤',
  chat: '💬',
  sub: '⭐',
};

interface LiveEventsPanelProps {
  events: FeedEvent[];
}

export default function LiveEventsPanel({ events }: LiveEventsPanelProps) {
  return (
    <section className="glass-panel p-4 flex flex-col w-full h-full">
      <div className="flex items-center gap-2 shrink-0 mb-3">
        <Activity className="w-5 h-5 text-primary" />
        <div>
          <p className="hud-label">Live события</p>
          <h3 className="font-heading font-semibold text-text-primary">Feed</h3>
        </div>
      </div>

      <div className="flex-1 min-h-0 themed-scroll pr-1 space-y-2">
        {events.map((event) => (
          <div
            key={event.id}
            className={`flex items-start gap-2 text-xs py-1.5 border-b border-border-card/30 last:border-0 ${
              event.isPinned ? 'bg-primary-dim/20 -mx-2 px-2 rounded' : ''
            }`}
          >
            <span className="text-text-muted font-heading shrink-0 pt-0.5">
              {new Date(event.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="shrink-0">{iconByType[event.sourceType] || '📌'}</span>
            <span className="text-text-secondary">{event.title}</span>
          </div>
        ))}
        {events.length === 0 && (
          <p className="text-xs text-text-muted italic text-center py-4">Нет событий</p>
        )}
      </div>
    </section>
  );
}
