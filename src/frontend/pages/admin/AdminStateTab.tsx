import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@frontend/lib/api';
import { API, StatusMode } from '@shared/constants';
import { useSiteState } from '@frontend/hooks/useSiteState';
import { Button } from '@frontend/components/ui/button';
import { Input } from '@frontend/components/ui/input';
import { Textarea } from '@frontend/components/ui/textarea';
import { Badge } from '@frontend/components/ui/badge';
import { Save, Radio } from 'lucide-react';

const statusOptions = [
  { mode: StatusMode.LIVE, label: 'LIVE', color: 'bg-live' },
  { mode: StatusMode.OFFLINE, label: 'OFFLINE', color: 'bg-text-muted' },
  { mode: StatusMode.POSSIBLE_TONIGHT, label: 'ВОЗМОЖНО', color: 'bg-warning' },
  { mode: StatusMode.SURPRISE_STREAM, label: 'СЮРПРИЗ', color: 'bg-accent' },
];

export default function AdminStateTab() {
  const { data: state } = useSiteState();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    currentStatusMode: 'OFFLINE',
    currentHookTitle: '',
    currentHookDescription: '',
    currentAnnouncement: '',
    currentGameSlug: '',
    currentFormatSlug: '',
    primaryCtaText: 'Смотреть на Kick',
    secondaryCtaText: 'Открыть чат',
  });

  useEffect(() => {
    if (state) {
      setForm({
        currentStatusMode: state.currentStatusMode,
        currentHookTitle: state.currentHookTitle || '',
        currentHookDescription: state.currentHookDescription || '',
        currentAnnouncement: state.currentAnnouncement || '',
        currentGameSlug: state.currentGame?.slug || '',
        currentFormatSlug: state.currentFormat?.slug || '',
        primaryCtaText: state.primaryCtaText,
        secondaryCtaText: state.secondaryCtaText,
      });
    }
  }, [state]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiFetch(API.ADMIN_STATE, {
        method: 'POST',
        json: {
          ...form,
          currentHookTitle: form.currentHookTitle || null,
          currentHookDescription: form.currentHookDescription || null,
          currentAnnouncement: form.currentAnnouncement || null,
          currentGameSlug: form.currentGameSlug || null,
          currentFormatSlug: form.currentFormatSlug || null,
        },
      });
      queryClient.invalidateQueries({ queryKey: ['siteState'] });
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Status mode */}
      <div className="space-y-2">
        <label className="hud-label">Режим статуса</label>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((opt) => (
            <button
              key={opt.mode}
              onClick={() => setForm({ ...form, currentStatusMode: opt.mode })}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                form.currentStatusMode === opt.mode
                  ? 'border-primary bg-primary-dim text-primary'
                  : 'border-border-card text-text-secondary hover:border-border-card-hover'
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full ${opt.color}`} />
              <span className="text-sm font-heading font-medium">{opt.label}</span>
            </button>
          ))}
        </div>
        {state && (
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Radio className="w-3 h-3" />
            Источник: <Badge variant="secondary" className="text-[10px]">{state.statusSource}</Badge>
          </div>
        )}
      </div>

      {/* Hook */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="hud-label">Хук (заголовок)</label>
          <Input value={form.currentHookTitle} onChange={(e) => setForm({ ...form, currentHookTitle: e.target.value })} placeholder="Чат ломает мне прохождение..." />
        </div>
        <div className="space-y-2">
          <label className="hud-label">Хук (описание)</label>
          <Input value={form.currentHookDescription} onChange={(e) => setForm({ ...form, currentHookDescription: e.target.value })} placeholder="Сегодня в Mass Effect..." />
        </div>
      </div>

      {/* Announcement */}
      <div className="space-y-2">
        <label className="hud-label">Анонс</label>
        <Textarea value={form.currentAnnouncement} onChange={(e) => setForm({ ...form, currentAnnouncement: e.target.value })} placeholder="Следующий стрим: сегодня, если горит!" rows={2} />
      </div>

      {/* Game / Format */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="hud-label">Текущая игра (slug)</label>
          <Input value={form.currentGameSlug} onChange={(e) => setForm({ ...form, currentGameSlug: e.target.value })} placeholder="mass-effect-legendary" />
        </div>
        <div className="space-y-2">
          <label className="hud-label">Текущий формат (slug)</label>
          <Input value={form.currentFormatSlug} onChange={(e) => setForm({ ...form, currentFormatSlug: e.target.value })} placeholder="chat-breaks-game" />
        </div>
      </div>

      {/* CTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="hud-label">Primary CTA</label>
          <Input value={form.primaryCtaText} onChange={(e) => setForm({ ...form, primaryCtaText: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className="hud-label">Secondary CTA</label>
          <Input value={form.secondaryCtaText} onChange={(e) => setForm({ ...form, secondaryCtaText: e.target.value })} />
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving}>
        <Save className="w-4 h-4 mr-1" />
        {saving ? 'Сохранение...' : 'Сохранить'}
      </Button>
    </div>
  );
}
