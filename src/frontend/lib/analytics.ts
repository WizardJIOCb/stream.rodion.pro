import { apiFetch } from './api';
import { API, ANALYTICS_EVENTS } from '@shared/constants';

export function trackEvent(eventType: string, eventMeta?: Record<string, unknown>) {
  // Fire and forget — don't block UI
  apiFetch(API.ANALYTICS_EVENT, {
    method: 'POST',
    json: { eventType, eventMeta },
  }).catch(() => {
    // Silently fail — analytics should never break UX
  });
}

export function trackKickChannelClick() {
  trackEvent(ANALYTICS_EVENTS.CLICK_KICK_CHANNEL);
}

export function trackKickChatClick() {
  trackEvent(ANALYTICS_EVENTS.CLICK_KICK_CHAT);
}

export function trackClipOpen(clipId: number, gameSlug?: string | null) {
  trackEvent(ANALYTICS_EVENTS.CLIP_OPEN, { clipId, gameSlug });
}

export function trackGamePageView(slug: string) {
  trackEvent(ANALYTICS_EVENTS.GAME_PAGE_VIEW, { slug });
}
