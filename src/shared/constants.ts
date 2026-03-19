export const StatusMode = {
  LIVE: 'LIVE',
  OFFLINE: 'OFFLINE',
  POSSIBLE_TONIGHT: 'POSSIBLE_TONIGHT',
  SURPRISE_STREAM: 'SURPRISE_STREAM',
} as const;

export type StatusMode = (typeof StatusMode)[keyof typeof StatusMode];

export const StatusSource = {
  MANUAL: 'manual',
  KICK: 'kick',
} as const;

export type StatusSource = (typeof StatusSource)[keyof typeof StatusSource];

export const KICK_CHANNEL_SLUG = 'wizardjiocb';
export const KICK_CHANNEL_URL = `https://kick.com/${KICK_CHANNEL_SLUG}`;
export const KICK_CHAT_URL = `https://kick.com/${KICK_CHANNEL_SLUG}/chatroom`;
export const KICK_PLAYER_URL = `https://player.kick.com/${KICK_CHANNEL_SLUG}`;

export const API = {
  PUBLIC_STATE: '/api/public/state',
  PUBLIC_REWARDS: '/api/public/rewards',
  PUBLIC_CLIPS: '/api/public/clips',
  PUBLIC_FEED: '/api/public/feed',
  PUBLIC_GAME: '/api/public/games',
  PUBLIC_FORMATS: '/api/public/formats',
  ADMIN_LOGIN: '/api/admin/login',
  ADMIN_STATE: '/api/admin/state',
  ADMIN_CLIPS: '/api/admin/clips',
  ADMIN_REWARDS: '/api/admin/rewards',
  ADMIN_FEED_EVENTS: '/api/admin/feed-events',
  ADMIN_PREDICTIONS: '/api/admin/predictions',
  ANALYTICS_EVENT: '/api/analytics/event',
  HEALTH: '/api/health',
} as const;

export const ANALYTICS_EVENTS = {
  CLICK_KICK_CHANNEL: 'click_kick_channel',
  CLICK_KICK_CHAT: 'click_kick_chat',
  CLIP_OPEN: 'clip_open',
  GAME_PAGE_VIEW: 'game_page_view',
  ADMIN_LOGIN: 'admin_login',
} as const;
