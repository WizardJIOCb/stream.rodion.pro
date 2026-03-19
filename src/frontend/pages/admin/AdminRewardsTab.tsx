import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@frontend/lib/api';
import { API } from '@shared/constants';
import { Button } from '@frontend/components/ui/button';
import { Input } from '@frontend/components/ui/input';
import { Textarea } from '@frontend/components/ui/textarea';
import { Badge } from '@frontend/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@frontend/components/ui/dialog';
import { Plus, Edit2, Trash2, Coins } from 'lucide-react';
import type { Reward } from '@shared/types';

export default function AdminRewardsTab() {
  const queryClient = useQueryClient();
  const { data: rewards = [] } = useQuery<Reward[]>({
    queryKey: ['adminRewards'],
    queryFn: () => apiFetch<Reward[]>(API.ADMIN_REWARDS),
  });

  const [editing, setEditing] = useState<Partial<Reward> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const emptyReward: Partial<Reward> = {
    title: '', description: '', cost: 100, isEnabled: true, isPaused: false,
    isUserInputRequired: false, noteForSite: '', sortOrder: 0,
  };

  const handleSave = async () => {
    if (!editing) return;
    const isNew = !editing.id;
    const url = isNew ? API.ADMIN_REWARDS : `${API.ADMIN_REWARDS}/${editing.id}`;
    const method = isNew ? 'POST' : 'PATCH';
    await apiFetch(url, {
      method,
      json: {
        title: editing.title,
        description: editing.description || null,
        cost: editing.cost,
        isEnabled: editing.isEnabled,
        isPaused: editing.isPaused,
        isUserInputRequired: editing.isUserInputRequired,
        noteForSite: editing.noteForSite || null,
        sortOrder: editing.sortOrder || 0,
      },
    });
    queryClient.invalidateQueries({ queryKey: ['adminRewards'] });
    queryClient.invalidateQueries({ queryKey: ['rewards'] });
    setDialogOpen(false);
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    await apiFetch(`${API.ADMIN_REWARDS}/${id}`, { method: 'DELETE' });
    queryClient.invalidateQueries({ queryKey: ['adminRewards'] });
    queryClient.invalidateQueries({ queryKey: ['rewards'] });
  };

  const toggleField = async (id: number, field: 'isEnabled' | 'isPaused', value: boolean) => {
    await apiFetch(`${API.ADMIN_REWARDS}/${id}`, { method: 'PATCH', json: { [field]: value } });
    queryClient.invalidateQueries({ queryKey: ['adminRewards'] });
    queryClient.invalidateQueries({ queryKey: ['rewards'] });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-text-secondary">{rewards.length} наград</span>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => setEditing(emptyReward)}>
              <Plus className="w-4 h-4 mr-1" /> Добавить
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing?.id ? 'Редактировать награду' : 'Новая награда'}</DialogTitle>
            </DialogHeader>
            {editing && (
              <div className="space-y-3">
                <Input placeholder="Название" value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                <Textarea placeholder="Описание" value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={2} />
                <Input type="number" placeholder="Стоимость" value={editing.cost || 0} onChange={(e) => setEditing({ ...editing, cost: parseInt(e.target.value) || 0 })} />
                <Input type="number" placeholder="Sort order" value={editing.sortOrder || 0} onChange={(e) => setEditing({ ...editing, sortOrder: parseInt(e.target.value) || 0 })} />
                <Textarea placeholder="Заметка для сайта" value={editing.noteForSite || ''} onChange={(e) => setEditing({ ...editing, noteForSite: e.target.value })} rows={2} />
                <div className="flex gap-4 text-sm">
                  <label className="flex items-center gap-2 text-text-secondary">
                    <input type="checkbox" checked={editing.isEnabled ?? true} onChange={(e) => setEditing({ ...editing, isEnabled: e.target.checked })} />
                    Включена
                  </label>
                  <label className="flex items-center gap-2 text-text-secondary">
                    <input type="checkbox" checked={editing.isPaused ?? false} onChange={(e) => setEditing({ ...editing, isPaused: e.target.checked })} />
                    На паузе
                  </label>
                  <label className="flex items-center gap-2 text-text-secondary">
                    <input type="checkbox" checked={editing.isUserInputRequired ?? false} onChange={(e) => setEditing({ ...editing, isUserInputRequired: e.target.checked })} />
                    Нужен ввод
                  </label>
                </div>
                <Button onClick={handleSave} className="w-full">Сохранить</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {rewards.map((r) => (
          <div key={r.id} className={`glass-panel p-3 flex items-center justify-between gap-3 ${!r.isEnabled ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Coins className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-text-primary truncate">{r.title}</p>
                  <Badge variant="default" className="text-[10px] shrink-0">{r.cost}</Badge>
                  {r.isPaused && <Badge variant="secondary" className="text-[10px]">Пауза</Badge>}
                </div>
                {r.noteForSite && <p className="text-xs text-text-muted truncate">{r.noteForSite}</p>}
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" onClick={() => toggleField(r.id, 'isEnabled', !r.isEnabled)} title={r.isEnabled ? 'Выключить' : 'Включить'}>
                <div className={`w-2.5 h-2.5 rounded-full ${r.isEnabled ? 'bg-success' : 'bg-text-muted'}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => { setEditing(r); setDialogOpen(true); }}>
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)}>
                <Trash2 className="w-3.5 h-3.5 text-live" />
              </Button>
            </div>
          </div>
        ))}
        {rewards.length === 0 && <p className="text-sm text-text-muted text-center py-4">Нет наград</p>}
      </div>
    </div>
  );
}
