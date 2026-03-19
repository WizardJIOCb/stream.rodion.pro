import { HelpCircle, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { KICK_CHANNEL_URL } from '@frontend/lib/constants';

interface PredictionPanelProps {
  predictions: string[];
}

export default function PredictionPanel({ predictions }: PredictionPanelProps) {
  if (predictions.length === 0) return null;

  // Pick a random prediction to showcase
  const featured = predictions[0];

  return (
    <section className="glass-panel p-4 flex flex-col w-full h-full">
      <div className="flex items-center justify-between shrink-0 mb-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-accent" />
          <div>
            <p className="hud-label">Предсказание</p>
            <h3 className="font-heading font-semibold text-text-primary">Prediction</h3>
          </div>
        </div>
        <span className="hud-label text-accent">Примеры</span>
      </div>

      <div className="flex-1 min-h-0 themed-scroll pr-1 space-y-4">
        {/* Featured prediction */}
        <div className="space-y-3">
          <p className="font-heading font-semibold text-sm text-text-primary">
            {featured}
          </p>

          {/* Mock yes/no bars */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-heading text-primary w-8">ДА</span>
              <div className="flex-1 h-6 bg-bg-surface rounded overflow-hidden">
                <div className="h-full bg-primary/30 rounded flex items-center px-2" style={{ width: '67%' }}>
                  <span className="text-[10px] font-heading text-primary">67%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-heading text-live w-8">НЕТ</span>
              <div className="flex-1 h-6 bg-bg-surface rounded overflow-hidden">
                <div className="h-full bg-live/30 rounded flex items-center px-2" style={{ width: '33%' }}>
                  <span className="text-[10px] font-heading text-live">33%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* More predictions */}
        <div className="space-y-1.5 pt-2 border-t border-border-card">
          <p className="hud-label">Другие примеры</p>
          {predictions.slice(1, 4).map((p, i) => (
            <p key={i} className="text-xs text-text-secondary">
              &bull; {p}
            </p>
          ))}
        </div>
      </div>

      <div className="shrink-0 pt-3">
        <a href={KICK_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
          <Button variant="secondary" size="sm" className="w-full">
            Ставки в чате Kick
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </a>
      </div>
    </section>
  );
}
