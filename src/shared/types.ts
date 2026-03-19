import type { StatusMode, StatusSource } from './constants';

export interface SiteState {
  siteTitle: string;
  siteSubtitle: string | null;
  primaryCtaText: string;
  secondaryCtaText: string;
  currentStatusMode: StatusMode;
  statusSource: StatusSource;
  lastKickSyncAt: string | null;
  manualOverrideActive: boolean;
  currentHookTitle: string | null;
  currentHookDescription: string | null;
  currentAnnouncement: string | null;
  currentGame: GameSummary | null;
  currentFormat: FormatSummary | null;
  updatedAt: string;
}

export interface GameSummary {
  slug: string;
  title: string;
  shortDescription: string | null;
}

export interface FormatSummary {
  slug: string;
  title: string;
}

export interface Game {
  id: number;
  slug: string;
  title: string;
  shortDescription: string | null;
  longDescription: string | null;
  heroCopy: string | null;
  rewardExamples: RewardExample[];
  predictionExamples: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RewardExample {
  title: string;
  description: string;
  cost: number;
}

export interface Format {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  participationRules: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface FeaturedClip {
  id: number;
  url: string;
  title: string;
  gameSlug: string | null;
  durationSeconds: number | null;
  thumbnailUrl: string | null;
  viewCountSnapshot: number | null;
  publishedLabel: string | null;
  tags: string[];
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Reward {
  id: number;
  kickRewardId: string | null;
  title: string;
  description: string | null;
  cost: number;
  backgroundColor: string | null;
  isEnabled: boolean;
  isPaused: boolean;
  isUserInputRequired: boolean;
  skipQueue: boolean;
  noteForSite: string | null;
  sortOrder: number;
  updatedAt: string;
}

export interface FeedEvent {
  id: number;
  sourceType: string;
  sourceEventId: string | null;
  title: string;
  body: Record<string, unknown> | null;
  isPublic: boolean;
  isPinned: boolean;
  createdAt: string;
}

export interface AnalyticsEventPayload {
  eventType: string;
  eventMeta?: Record<string, unknown>;
}

export interface GamePageData extends Game {
  relatedFormats: Format[];
  relatedClips: FeaturedClip[];
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}
