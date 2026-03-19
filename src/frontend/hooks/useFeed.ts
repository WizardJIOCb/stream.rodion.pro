import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@frontend/lib/api';
import { API } from '@shared/constants';
import type { FeedEvent } from '@shared/types';

export function useFeed() {
  return useQuery<FeedEvent[]>({
    queryKey: ['feed'],
    queryFn: () => apiFetch<FeedEvent[]>(API.PUBLIC_FEED),
    refetchInterval: 30_000,
  });
}
