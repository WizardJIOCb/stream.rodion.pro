import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@frontend/lib/api';
import { API } from '@shared/constants';
import { useSiteState } from '@frontend/hooks/useSiteState';
import { useRewards } from '@frontend/hooks/useRewards';
import { useClips } from '@frontend/hooks/useClips';
import { useFeed } from '@frontend/hooks/useFeed';
import HeroSection from '@frontend/components/home/HeroSection';
import CommandPanel from '@frontend/components/home/CommandPanel';
import HowItWorksSection from '@frontend/components/home/HowItWorksSection';
import RewardsBoard from '@frontend/components/home/RewardsBoard';
import PredictionPanel from '@frontend/components/home/PredictionPanel';
import LiveEventsPanel from '@frontend/components/home/LiveEventsPanel';
import ClipsCarousel from '@frontend/components/home/ClipsCarousel';
import TodayFormatPanel from '@frontend/components/home/TodayFormatPanel';
import AboutSection from '@frontend/components/home/AboutSection';
import type { Format, Game } from '@shared/types';

export default function HomePage() {
  const { data: state, isLoading: stateLoading } = useSiteState();
  const { data: rewards = [] } = useRewards();
  const { data: clips = [] } = useClips();
  const { data: feedEvents = [] } = useFeed();
  const { data: formats = [] } = useQuery<Format[]>({
    queryKey: ['formats'],
    queryFn: () => apiFetch<Format[]>(API.PUBLIC_FORMATS),
  });

  // Get current game for predictions
  const { data: currentGame } = useQuery<Game>({
    queryKey: ['game', state?.currentGame?.slug],
    queryFn: () => apiFetch<Game>(`${API.PUBLIC_GAME}/${state!.currentGame!.slug}`),
    enabled: !!state?.currentGame?.slug,
  });

  if (stateLoading || !state) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Hero + Command Panel grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <HeroSection state={state} />
        </div>
        <div className="lg:col-span-1">
          <CommandPanel state={state} feedEvents={feedEvents} />
        </div>
      </div>

      {/* How it works */}
      <HowItWorksSection />

      {/* Rewards + Prediction + Live Events — equal height with scroll */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ gridAutoRows: '1fr' }}>
        <div className="lg:col-span-1 flex">
          <RewardsBoard rewards={rewards} />
        </div>
        <div className="lg:col-span-1 flex">
          <PredictionPanel predictions={currentGame?.predictionExamples || []} />
        </div>
        <div className="lg:col-span-1 flex">
          <LiveEventsPanel events={feedEvents} />
        </div>
      </div>

      {/* Kick Player + Format — format matches player height */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:items-stretch">
        <div className="lg:col-span-2">
          <div className="glass-panel overflow-hidden rounded-xl h-full" style={{ aspectRatio: '16/9' }}>
            <iframe
              src="https://player.kick.com/wizardjiocb"
              title="WizardJIOCb — Kick Player"
              className="w-full h-full border-0"
              allowFullScreen
              allow="autoplay; encrypted-media; picture-in-picture"
            />
          </div>
        </div>
        <div className="lg:col-span-1 flex">
          <TodayFormatPanel formats={formats} currentFormatSlug={state.currentFormat?.slug || null} />
        </div>
      </div>

      {/* Clips */}
      <ClipsCarousel clips={clips} />

      {/* About */}
      <AboutSection />
    </div>
  );
}
