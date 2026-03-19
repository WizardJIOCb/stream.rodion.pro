import {
  pgTable,
  serial,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core';

export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  siteTitle: text('site_title').notNull().default('WizardJIOCb — Streaming HQ'),
  siteSubtitle: text('site_subtitle'),
  primaryCtaText: text('primary_cta_text').notNull().default('Смотреть на Kick'),
  secondaryCtaText: text('secondary_cta_text').notNull().default('Открыть чат на Kick'),
  currentStatusMode: text('current_status_mode').notNull().default('OFFLINE'),
  statusSource: text('status_source').notNull().default('manual'),
  lastKickSyncAt: timestamp('last_kick_sync_at', { withTimezone: true }),
  manualOverrideActive: boolean('manual_override_active').notNull().default(true),
  currentHookTitle: text('current_hook_title'),
  currentHookDescription: text('current_hook_description'),
  currentAnnouncement: text('current_announcement'),
  currentGameSlug: text('current_game_slug'),
  currentFormatSlug: text('current_format_slug'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const games = pgTable('games', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  shortDescription: text('short_description'),
  longDescription: text('long_description'),
  heroCopy: text('hero_copy'),
  rewardExamples: jsonb('reward_examples').$type<Array<{ title: string; description: string; cost: number }>>().default([]),
  predictionExamples: jsonb('prediction_examples').$type<string[]>().default([]),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const formats = pgTable('formats', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  participationRules: text('participation_rules'),
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const featuredClips = pgTable('featured_clips', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  title: text('title').notNull(),
  gameSlug: text('game_slug'),
  durationSeconds: integer('duration_seconds'),
  thumbnailUrl: text('thumbnail_url'),
  viewCountSnapshot: integer('view_count_snapshot'),
  publishedLabel: text('published_label'),
  tags: jsonb('tags').$type<string[]>().default([]),
  isFeatured: boolean('is_featured').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const rewardCache = pgTable('reward_cache', {
  id: serial('id').primaryKey(),
  kickRewardId: text('kick_reward_id').unique(),
  title: text('title').notNull(),
  description: text('description'),
  cost: integer('cost').notNull(),
  backgroundColor: text('background_color'),
  isEnabled: boolean('is_enabled').notNull().default(true),
  isPaused: boolean('is_paused').notNull().default(false),
  isUserInputRequired: boolean('is_user_input_required').notNull().default(false),
  skipQueue: boolean('skip_queue').notNull().default(false),
  noteForSite: text('note_for_site'),
  sortOrder: integer('sort_order').notNull().default(0),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const streamSessions = pgTable('stream_sessions', {
  id: serial('id').primaryKey(),
  kickSessionKey: text('kick_session_key').unique(),
  title: text('title').notNull(),
  categoryName: text('category_name'),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
  endedAt: timestamp('ended_at', { withTimezone: true }),
  isLive: boolean('is_live').notNull().default(false),
  viewerCountPeak: integer('viewer_count_peak'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const adminSessions = pgTable('admin_sessions', {
  id: serial('id').primaryKey(),
  tokenHash: text('token_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  isRevoked: boolean('is_revoked').notNull().default(false),
});

export const siteFeedEvents = pgTable('site_feed_events', {
  id: serial('id').primaryKey(),
  sourceType: text('source_type').notNull(),
  sourceEventId: text('source_event_id'),
  title: text('title').notNull(),
  body: jsonb('body').$type<Record<string, unknown>>(),
  isPublic: boolean('is_public').notNull().default(true),
  isPinned: boolean('is_pinned').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const analyticsEvents = pgTable('analytics_events', {
  id: serial('id').primaryKey(),
  eventType: text('event_type').notNull(),
  eventMeta: jsonb('event_meta').$type<Record<string, unknown>>(),
  ipHash: text('ip_hash'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
