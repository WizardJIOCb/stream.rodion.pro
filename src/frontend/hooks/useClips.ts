import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@frontend/lib/api';
import { API } from '@shared/constants';
import type { FeaturedClip } from '@shared/types';

export function useClips() {
  return useQuery<FeaturedClip[]>({
    queryKey: ['clips'],
    queryFn: () => apiFetch<FeaturedClip[]>(API.PUBLIC_CLIPS),
  });
}
