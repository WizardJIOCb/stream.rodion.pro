import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@frontend/lib/api';
import { API } from '@shared/constants';
import { Button } from '@frontend/components/ui/button';
import { Input } from '@frontend/components/ui/input';
import { Badge } from '@frontend/components/ui/badge';
import { Plus, Trash2, Pin } from 'lucide-react';
import type { FeedEvent } from '@shared/types';

export default function AdminFeedTab() {
  const queryClient = useQueryClient();
  const { data: events = [] } = useQuery<FeedEvent[]>({
    queryKey: ['adminFeed'],
    queryFn: () => apiFetch<FeedEvent[]>(API.ADMIN_FEED_EVENTS),
  });

  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('status');

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    await apiFetch(API.ADMIN_FEED_EVENTS, {
      method: 'POST',
      json: { sourceType: newType, title: newTitle, isPublic: true, isPinned: false },
    });
    queryClient.invalidateQueries({ queryKey: ['adminFeed'] });
    queryClient.invalidateQueries({ queryKey: ['feed'] });
    setNewTitle('');
  };

  const handleDelete = async (id: number) => {
    await apiFetch(`${API.ADMIN_FEED_EVENTS}/${id}`, { method: 'DELETE' });
    queryClient.invalidateQueries({ queryKey: ['adminFeed'] });
    queryClient.invalidateQueries({ queryKey: ['feed'] });
  };

  const togglePin = async (id: number, isPinned: boolean) => {
    await apiFetch(`${API.ADMIN_FEED_EVENTS}/${id}`, { method: 'PATCH', json: { isPinned: !isPinned } });
    queryClient.invalidateQueries({ queryKey: ['adminFeed'] });
    queryClient.invalidateQueries({ queryKey: ['feed'] });
  };

  const togglePublic = async (id: number, isPublic: boolean) => {
    await apiFetch(`${API.ADMIN_FEED_EVENTS}/${id}`, { method: 'PATCH', json: { isPublic: !isPublic } });
    queryClient.invalidateQueries({ queryKey: ['adminFeed'] });
    queryClient.invalidateQueries({ queryKey: ['feed'] });
  };

  return (
    <div className="space-y-4">
      {/* Quick create */}
      <div className="glass-panel p-4 space-y-3">
        <p className="hud-label">Быстрое событие</p>
        <div className="flex gap-2">
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="h-10 rounded-lg border border-border-card bg-bg-card/60 px-2 text-sm text-text-primary"
          >
            <option value="status">Статус</option>
            <option value="reward">Награда</option>
            <option value="chat">Чат</option>
            <option value="follow">Фолловер</option>
          </select>
          <Input
            placeholder="Текст события..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            className="flex-1"
          />
          <Button onClick={handleCreate} disabled={!newTitle.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Events list */}
      <div className="space-y-1.5">
        {events.map((event) => (
          <div key={event.id} className={`glass-panel p-3 flex items-center gap-3 ${!event.isPublic ? 'opacity-50' : ''}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">{event.sourceType}</Badge>
                <span className="text-sm text-text-primary truncate">{event.title}</span>
                {event.isPinned && <Pin className="w-3 h-3 text-primary shrink-0" />}
              </div>
              <span className="text-xs text-text-muted">
                {new Date(event.createdAt).toLocaleString('ru-RU')}
              </span>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" onClick={() => togglePublic(event.id, event.isPublic)} title={event.isPublic ? 'Скрыть' : 'Показать'}>
                <div className={`w-2.5 h-2.5 rounded-full ${event.isPublic ? 'bg-success' : 'bg-text-muted'}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => togglePin(event.id, event.isPinned)} title="Закрепить">
                <Pin className={`w-3.5 h-3.5 ${event.isPinned ? 'text-primary' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)}>
                <Trash2 className="w-3.5 h-3.5 text-live" />
              </Button>
            </div>
          </div>
        ))}
        {events.length === 0 && <p className="text-sm text-text-muted text-center py-4">Нет событий</p>}
      </div>
    </div>
  );
}
