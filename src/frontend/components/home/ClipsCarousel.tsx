import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { Badge } from '../ui/badge';
import { trackClipOpen } from '@frontend/lib/analytics';
import { formatDuration } from '@frontend/lib/utils';
import type { FeaturedClip } from '@shared/types';

interface ClipsCarouselProps {
  clips: FeaturedClip[];
}

export default function ClipsCarousel({ clips }: ClipsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = dir === 'left' ? -300 : 300;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  if (clips.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-primary rounded-full" />
          <div>
            <p className="hud-label">Последние клипы</p>
            <h2 className="section-title">Featured Clips</h2>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-md border border-border-card text-text-secondary hover:text-text-primary hover:border-border-card-hover transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-md border border-border-card text-text-secondary hover:text-text-primary hover:border-border-card-hover transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {clips.map((clip) => (
          <a
            key={clip.id}
            href={clip.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClipOpen(clip.id, clip.gameSlug)}
            className="shrink-0 w-[220px] group"
          >
            <div className="relative rounded-lg overflow-hidden bg-bg-card aspect-video">
              {clip.thumbnailUrl ? (
                <img
                  src={clip.thumbnailUrl}
                  alt={clip.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-bg-surface flex items-center justify-center">
                  <Play className="w-8 h-8 text-text-muted" />
                </div>
              )}
              {/* Duration overlay */}
              {clip.durationSeconds && (
                <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-heading px-1.5 py-0.5 rounded">
                  {formatDuration(clip.durationSeconds)}
                </span>
              )}
              {/* Play overlay on hover */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="w-10 h-10 text-white fill-white" />
              </div>
            </div>
            <div className="mt-2 space-y-1">
              <p className="text-sm font-medium text-text-primary line-clamp-1 group-hover:text-primary transition-colors">
                {clip.title}
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {clip.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[9px]">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
