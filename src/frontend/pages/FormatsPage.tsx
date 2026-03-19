import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@frontend/lib/api';
import { API } from '@shared/constants';
import type { Format } from '@shared/types';

export default function FormatsPage() {
  const { data: formats = [], isLoading } = useQuery<Format[]>({
    queryKey: ['formats'],
    queryFn: () => apiFetch<Format[]>(API.PUBLIC_FORMATS),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div>
        <p className="hud-label">Что происходит на стриме</p>
        <h1 className="section-title text-3xl">Форматы</h1>
        <p className="text-text-secondary mt-2">
          Каждый стрим — это не просто играю и молчу. Вот форматы, которые делают стрим интерактивным.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formats.map((format) => (
            <div key={format.id} className="glass-panel-hover p-5 space-y-3">
              <h2 className="font-heading font-bold text-xl text-text-primary">{format.title}</h2>
              {format.description && (
                <p className="text-text-secondary leading-relaxed">{format.description}</p>
              )}
              {format.participationRules && (
                <div className="pt-2 border-t border-border-card">
                  <p className="hud-label mb-1">Как участвовать</p>
                  <p className="text-sm text-text-secondary">{format.participationRules}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
