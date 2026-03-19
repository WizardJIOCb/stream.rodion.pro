import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@frontend/lib/api';
import { API } from '@shared/constants';
import { Button } from '@frontend/components/ui/button';
import { Input } from '@frontend/components/ui/input';
import { Textarea } from '@frontend/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@frontend/components/ui/dialog';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import type { FeaturedClip } from '@shared/types';

export default function AdminClipsTab() {
  const queryClient = useQueryClient();
  const { data: clips = [] } = useQuery<FeaturedClip[]>({
    queryKey: ['adminClips'],
    queryFn: () => apiFetch<FeaturedClip[]>(API.ADMIN_CLIPS),
  });

  const [editingClip, setEditingClip] = useState<Partial<FeaturedClip> | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const emptyClip = { url: '', title: '', gameSlug: '', thumbnailUrl: '', tags: [], sortOrder: 0 };

  const parseTags = (raw: string) => raw.split(',').map(t => t.trim()).filter(Boolean);

  const handleSave = async () => {
    if (!editingClip) return;
    const isNew = !editingClip.id;
    const url = isNew ? API.ADMIN_CLIPS : `${API.ADMIN_CLIPS}/${editingClip.id}`;
    const method = isNew ? 'POST' : 'PATCH';
    await apiFetch(url, {
      method,
      json: {
        url: editingClip.url,
        title: editingClip.title,
        gameSlug: editingClip.gameSlug || null,
        thumbnailUrl: editingClip.thumbnailUrl || null,
        tags: parseTags(tagsInput),
        sortOrder: editingClip.sortOrder || 0,
        isFeatured: true,
      },
    });
    queryClient.invalidateQueries({ queryKey: ['adminClips'] });
    queryClient.invalidateQueries({ queryKey: ['clips'] });
    setDialogOpen(false);
    setEditingClip(null);
  };

  const handleDelete = async (id: number) => {
    await apiFetch(`${API.ADMIN_CLIPS}/${id}`, { method: 'DELETE' });
    queryClient.invalidateQueries({ queryKey: ['adminClips'] });
    queryClient.invalidateQueries({ queryKey: ['clips'] });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-text-secondary">{clips.length} клипов</span>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => { setEditingClip(emptyClip); setTagsInput(''); }}>
              <Plus className="w-4 h-4 mr-1" /> Добавить
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingClip?.id ? 'Редактировать клип' : 'Новый клип'}</DialogTitle>
            </DialogHeader>
            {editingClip && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-text-secondary mb-1 block">URL клипа</label>
                  <Input placeholder="https://kick.com/video/..." value={editingClip.url || ''} onChange={(e) => setEditingClip({ ...editingClip, url: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-text-secondary mb-1 block">Название</label>
                  <Input placeholder="Шепард умер 5 раз подряд" value={editingClip.title || ''} onChange={(e) => setEditingClip({ ...editingClip, title: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-text-secondary mb-1 block">Игра (slug)</label>
                  <Input placeholder="mass-effect-legendary" value={editingClip.gameSlug || ''} onChange={(e) => setEditingClip({ ...editingClip, gameSlug: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-text-secondary mb-1 block">URL превью</label>
                  <Input placeholder="https://..." value={editingClip.thumbnailUrl || ''} onChange={(e) => setEditingClip({ ...editingClip, thumbnailUrl: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-text-secondary mb-1 block">Теги (через запятую)</label>
                  <Input placeholder="mass effect, смерть, хаос" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-text-secondary mb-1 block">Порядок сортировки</label>
                  <Input type="number" placeholder="0" value={editingClip.sortOrder || 0} onChange={(e) => setEditingClip({ ...editingClip, sortOrder: parseInt(e.target.value) || 0 })} />
                </div>
                <Button onClick={handleSave} className="w-full">Сохранить</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {clips.map((clip) => (
          <div key={clip.id} className="glass-panel p-3 flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{clip.title}</p>
              <p className="text-xs text-text-muted truncate">{clip.url}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" onClick={() => { setEditingClip(clip); setTagsInput((clip.tags || []).join(', ')); setDialogOpen(true); }}>
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(clip.id)}>
                <Trash2 className="w-3.5 h-3.5 text-live" />
              </Button>
            </div>
          </div>
        ))}
        {clips.length === 0 && <p className="text-sm text-text-muted text-center py-4">Нет клипов</p>}
      </div>
    </div>
  );
}
