import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@frontend/lib/api';
import { API } from '@shared/constants';
import { POLLING_INTERVAL } from '@frontend/lib/constants';
import type { SiteState } from '@shared/types';

export function useSiteState() {
  return useQuery<SiteState>({
    queryKey: ['siteState'],
    queryFn: () => apiFetch<SiteState>(API.PUBLIC_STATE),
    refetchInterval: POLLING_INTERVAL,
  });
}
