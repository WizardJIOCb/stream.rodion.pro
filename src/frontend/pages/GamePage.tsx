import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { apiFetch } from '@frontend/lib/api';
import { API } from '@shared/constants';
import { Badge } from '@frontend/components/ui/badge';
import { Button } from '@frontend/components/ui/button';
import { Coins, HelpCircle, Gamepad2, ExternalLink, Shield } from 'lucide-react';
import { KICK_CHANNEL_URL } from '@frontend/lib/constants';
import { trackGamePageView, trackKickChannelClick } from '@frontend/lib/analytics';
import type { GamePageData } from '@shared/types';

export default function GamePage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: game, isLoading } = useQuery<GamePageData>({
    queryKey: ['game', slug],
    queryFn: () => apiFetch<GamePageData>(`${API.PUBLIC_GAME}/${slug}`),
    enabled: !!slug,
  });

  useEffect(() => {
    if (slug) trackGamePageView(slug);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-text-secondary text-lg">Игра не найдена</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Hero */}
      <div className="glass-panel p-6 md:p-8 space-y-4 relative overflow-hidden">
        <div className="absolute top-4 right-4">
          <Shield className="w-12 h-12 text-primary/20" />
        </div>
        <Badge variant="default">Текущая игра</Badge>
        <h1 className="font-heading font-bold text-3xl md:text-4xl text-text-primary">{game.title}</h1>
        {game.heroCopy && (
          <p className="text-lg text-primary font-heading font-medium">{game.heroCopy}</p>
        )}
        {game.longDescription && (
          <p className="text-text-secondary max-w-3xl leading-relaxed">{game.longDescription}</p>
        )}
        <a href={KICK_CHANNEL_URL} target="_blank" rel="noopener noreferrer" onClick={trackKickChannelClick}>
          <Button size="lg">
            Смотреть на Kick
            <ExternalLink className="w-4 h-4 ml-1" />
          </Button>
        </a>
      </div>

      {/* Rewards for this game */}
      {game.rewardExamples && game.rewardExamples.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Coins className="w-5 h-5 text-primary" />
            <div>
              <p className="hud-label">Награды для этой игры</p>
              <h2 className="section-title">Rewards</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {game.rewardExamples.map((r, i) => (
              <div key={i} className="glass-panel-hover p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Coins className="w-4 h-4 text-primary" />
                  <Badge variant="default" className="text-[10px]">{r.cost}</Badge>
                </div>
                <h3 className="font-heading font-semibold text-sm text-text-primary">{r.title}</h3>
                <p className="text-xs text-text-secondary">{r.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Predictions */}
      {game.predictionExamples && game.predictionExamples.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-accent" />
            <div>
              <p className="hud-label">Примеры предсказаний</p>
              <h2 className="section-title">Predictions</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {game.predictionExamples.map((p, i) => (
              <div key={i} className="glass-panel-hover p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent font-heading font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm text-text-primary font-medium">{p}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Formats */}
      {game.relatedFormats && game.relatedFormats.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-5 h-5 text-primary" />
            <div>
              <p className="hud-label">Форматы</p>
              <h2 className="section-title">Stream Formats</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {game.relatedFormats.map((f) => (
              <div key={f.id} className="glass-panel-hover p-4 space-y-2">
                <h3 className="font-heading font-semibold text-text-primary">{f.title}</h3>
                {f.description && <p className="text-sm text-text-secondary">{f.description}</p>}
                {f.participationRules && (
                  <p className="text-xs text-text-muted italic">{f.participationRules}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
