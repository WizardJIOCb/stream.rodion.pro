import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@frontend/lib/api';
import { API } from '@shared/constants';
import type { Reward } from '@shared/types';

export function useRewards() {
  return useQuery<Reward[]>({
    queryKey: ['rewards'],
    queryFn: () => apiFetch<Reward[]>(API.PUBLIC_REWARDS),
  });
}
