import type { StatusMode } from '@shared/constants';
import { Badge } from '../ui/badge';

const statusConfig: Record<string, { label: string; variant: 'live' | 'offline' | 'possible' | 'surprise' }> = {
  LIVE: { label: 'LIVE', variant: 'live' },
  OFFLINE: { label: 'OFFLINE', variant: 'offline' },
  POSSIBLE_TONIGHT: { label: 'ВОЗМОЖНО СЕГОДНЯ', variant: 'possible' },
  SURPRISE_STREAM: { label: 'СЮРПРИЗ', variant: 'surprise' },
};

export default function StatusBadge({ mode }: { mode: StatusMode }) {
  const config = statusConfig[mode] || statusConfig.OFFLINE;
  return (
    <Badge variant={config.variant} className="gap-1.5">
      {mode === 'LIVE' && (
        <span className="w-2 h-2 rounded-full bg-white animate-pulse-slow" />
      )}
      {config.label}
    </Badge>
  );
}
