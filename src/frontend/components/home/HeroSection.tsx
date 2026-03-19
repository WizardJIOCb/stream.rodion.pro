import { Radio, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import StatusBadge from '../layout/StatusBadge';
import { KICK_CHANNEL_URL, KICK_CHAT_URL } from '@frontend/lib/constants';
import { trackKickChannelClick, trackKickChatClick } from '@frontend/lib/analytics';
import type { SiteState } from '@shared/types';

interface HeroSectionProps {
  state: SiteState;
}

export default function HeroSection({ state }: HeroSectionProps) {
  const isLive = state.currentStatusMode === 'LIVE';

  return (
    <div className="relative overflow-hidden rounded-xl min-h-[320px] md:min-h-[400px] flex flex-col justify-end">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/mass-effect-norm.jpg)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg-base/80 to-transparent" />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 space-y-4">
        {/* Status */}
        <div className="flex items-center gap-3">
          <StatusBadge mode={state.currentStatusMode} />
          {isLive && (
            <span className="text-xs text-text-secondary font-heading uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-live" />
              Сейчас в эфире
            </span>
          )}
        </div>

        {/* Game title */}
        {state.currentGame && (
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-text-primary leading-tight">
            {state.currentGame.title}
          </h1>
        )}

        {/* Hook */}
        {state.currentHookTitle && (
          <div className="space-y-1">
            <p className="hud-label text-primary">Текущий хук:</p>
            <p className="text-lg md:text-xl font-heading font-semibold text-text-primary max-w-2xl">
              {state.currentHookTitle}
            </p>
          </div>
        )}
        {state.currentHookDescription && (
          <p className="text-text-secondary max-w-xl text-sm md:text-base">
            {state.currentHookDescription}
          </p>
        )}

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 pt-2">
          <a href={KICK_CHANNEL_URL} target="_blank" rel="noopener noreferrer" onClick={trackKickChannelClick}>
            <Button size="lg">
              {state.primaryCtaText}
              <ExternalLink className="w-4 h-4 ml-1" />
            </Button>
          </a>
          <a href={KICK_CHAT_URL} target="_blank" rel="noopener noreferrer" onClick={trackKickChatClick}>
            <Button variant="secondary" size="lg">
              {state.secondaryCtaText}
              <ExternalLink className="w-4 h-4 ml-1" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
