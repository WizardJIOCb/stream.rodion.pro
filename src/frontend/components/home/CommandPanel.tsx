import { Zap, Target, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import type { SiteState } from '@shared/types';
import type { FeedEvent } from '@shared/types';

interface CommandPanelProps {
  state: SiteState;
  feedEvents: FeedEvent[];
}

export default function CommandPanel({ state, feedEvents }: CommandPanelProps) {
  return (
    <div className="glass-panel p-4 space-y-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="hud-label">Командный центр</p>
          <h2 className="font-heading font-semibold text-lg text-text-primary">Влияй на стрим</h2>
        </div>
        <Zap className="w-5 h-5 text-primary" />
      </div>

      {/* Active challenge */}
      <Card className="!p-3 bg-primary-dim/30 border-primary/20">
        <CardContent className="space-y-1">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="hud-label text-primary">Активный челлендж</span>
          </div>
          <p className="text-sm font-heading font-medium text-text-primary">
            {state.currentHookTitle || 'Нет активного челленджа'}
          </p>
        </CardContent>
      </Card>

      {/* Current format */}
      {state.currentFormat && (
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" />
          <Badge variant="secondary" className="text-xs">
            {state.currentFormat.title}
          </Badge>
        </div>
      )}

      {/* Recent activity */}
      <div className="flex-1 space-y-2 overflow-hidden">
        <p className="hud-label flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          Последние события
        </p>
        <div className="space-y-1.5 overflow-y-auto max-h-[200px] pr-1">
          {feedEvents.slice(0, 5).map((event) => (
            <div
              key={event.id}
              className="text-xs text-text-secondary py-1 border-b border-border-card/50 last:border-0"
            >
              <span className="text-text-muted font-heading">
                {new Date(event.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </span>
              {' '}
              <span className="text-text-secondary">{event.title}</span>
            </div>
          ))}
          {feedEvents.length === 0 && (
            <p className="text-xs text-text-muted italic">Пока нет событий</p>
          )}
        </div>
      </div>
    </div>
  );
}
