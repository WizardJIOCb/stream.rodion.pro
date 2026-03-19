import { Coins, Pause, MessageSquare } from 'lucide-react';
import { Badge } from '../ui/badge';
import type { Reward } from '@shared/types';

interface RewardsBoardProps {
  rewards: Reward[];
}

export default function RewardsBoard({ rewards }: RewardsBoardProps) {
  const enabledRewards = rewards.filter((r) => r.isEnabled);

  return (
    <section className="glass-panel p-4 space-y-4 flex flex-col w-full h-full">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-primary rounded-full" />
          <div>
            <p className="hud-label">Награды чата</p>
            <h2 className="font-heading font-bold text-lg text-text-primary">Rewards</h2>
          </div>
        </div>
        <span className="hud-label">
          Доступно: {enabledRewards.filter((r) => !r.isPaused).length}
        </span>
      </div>

      <div className="flex-1 min-h-0 themed-scroll pr-1">
        <div className="grid grid-cols-2 gap-3">
          {enabledRewards.map((reward) => (
            <div
              key={reward.id}
              className={`glass-panel-hover p-3 space-y-2 ${reward.isPaused ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-lg bg-primary-dim flex items-center justify-center">
                  <Coins className="w-4 h-4 text-primary" />
                </div>
                <Badge variant="default" className="text-[10px]">
                  {reward.cost}
                </Badge>
              </div>
              <h3 className="font-heading font-semibold text-sm text-text-primary leading-tight">
                {reward.title}
              </h3>
              {reward.description && (
                <p className="text-xs text-text-secondary line-clamp-2">{reward.description}</p>
              )}
              <div className="flex items-center gap-2">
                {reward.isPaused && (
                  <Badge variant="secondary" className="text-[10px] gap-1">
                    <Pause className="w-2.5 h-2.5" />
                    Пауза
                  </Badge>
                )}
                {reward.isUserInputRequired && (
                  <Badge variant="secondary" className="text-[10px] gap-1">
                    <MessageSquare className="w-2.5 h-2.5" />
                    Ввод
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
