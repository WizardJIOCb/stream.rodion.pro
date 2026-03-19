import { useClips } from '@frontend/hooks/useClips';
import { Badge } from '@frontend/components/ui/badge';
import { Play } from 'lucide-react';
import { trackClipOpen } from '@frontend/lib/analytics';
import { formatDuration } from '@frontend/lib/utils';

export default function ClipsPage() {
  const { data: clips = [], isLoading } = useClips();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div>
        <p className="hud-label">Архив</p>
        <h1 className="section-title text-3xl">Клипы</h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : clips.length === 0 ? (
        <p className="text-text-secondary text-center py-12">Клипы пока не добавлены</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clips.map((clip) => (
            <a
              key={clip.id}
              href={clip.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClipOpen(clip.id, clip.gameSlug)}
              className="glass-panel-hover overflow-hidden group"
            >
              <div className="relative aspect-video bg-bg-surface">
                {clip.thumbnailUrl ? (
                  <img src={clip.thumbnailUrl} alt={clip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play className="w-10 h-10 text-text-muted" />
                  </div>
                )}
                {clip.durationSeconds && (
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-heading px-2 py-0.5 rounded">
                    {formatDuration(clip.durationSeconds)}
                  </span>
                )}
              </div>
              <div className="p-3 space-y-2">
                <h3 className="font-heading font-semibold text-text-primary group-hover:text-primary transition-colors">
                  {clip.title}
                </h3>
                <div className="flex gap-1.5 flex-wrap">
                  {clip.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
