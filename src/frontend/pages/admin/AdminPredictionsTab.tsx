import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@frontend/lib/api';
import { API } from '@shared/constants';
import { Button } from '@frontend/components/ui/button';
import { Input } from '@frontend/components/ui/input';
import { Plus, Trash2, Save, HelpCircle } from 'lucide-react';

export default function AdminPredictionsTab() {
  const queryClient = useQueryClient();
  const gameSlug = 'mass-effect-legendary'; // MVP: hardcoded, later selectable

  const { data: predictions = [] } = useQuery<string[]>({
    queryKey: ['adminPredictions', gameSlug],
    queryFn: () => apiFetch<string[]>(`${API.ADMIN_PREDICTIONS}/${gameSlug}`),
  });

  const [items, setItems] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setItems(predictions);
  }, [predictions]);

  const handleSave = async () => {
    setSaving(true);
    await apiFetch(API.ADMIN_PREDICTIONS, {
      method: 'PUT',
      json: { gameSlug, predictionExamples: items.filter((i) => i.trim()) },
    });
    queryClient.invalidateQueries({ queryKey: ['adminPredictions'] });
    queryClient.invalidateQueries({ queryKey: ['game'] });
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-accent" />
          <div>
            <p className="hud-label">Игра: {gameSlug}</p>
            <p className="text-sm text-text-secondary">{items.length} предсказаний</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} size="sm">
          <Save className="w-4 h-4 mr-1" />
          {saving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <div className="w-8 h-10 flex items-center justify-center text-xs text-text-muted font-heading">
              {i + 1}
            </div>
            <Input
              value={item}
              onChange={(e) => {
                const copy = [...items];
                copy[i] = e.target.value;
                setItems(copy);
              }}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setItems(items.filter((_, idx) => idx !== i))}
            >
              <Trash2 className="w-3.5 h-3.5 text-live" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setItems([...items, ''])}
      >
        <Plus className="w-4 h-4 mr-1" /> Добавить предсказание
      </Button>

      {/* Preview */}
      {items.length > 0 && (
        <div className="glass-panel p-4 space-y-2">
          <p className="hud-label">Превью на странице игры</p>
          {items.filter(Boolean).map((p, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div className="w-6 h-6 rounded bg-accent/20 flex items-center justify-center text-accent font-heading text-xs">
                {i + 1}
              </div>
              <span className="text-text-primary">{p}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
