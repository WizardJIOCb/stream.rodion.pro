# SDD — stream.rodion.pro

Version: 1.0  
Author: OpenAI / ChatGPT  
Date: 2026-03-19  
Target owner: Rodion / WizardJIOCb

---

## 1. Product summary

`stream.rodion.pro` is the personal streaming HQ for the Kick channel `wizardjiocb`.

The product is **not** just a mirror of Kick. It must do three jobs:

1. **Catch attention fast** — explain why tonight’s stream is worth joining.
2. **Convert visitors into active chatters** — show how Channel Points, predictions, mini-challenges, formats and rewards work.
3. **Act as Rodion’s operator panel** — quickly update stream context, feature clips, surface current rewards, and react to Kick live/chat/reward events.

Core product thesis:

- Rodion is **not** a rigid-schedule streamer.
- The site must support a **signal-based model**: “I’m live / I might go live tonight / here is today’s hook”.
- The site must reinforce the channel personality: **hot, smart, honest, interactive, game + dev/AI commentary**.
- Kick remains the primary place for **real chat participation, follows, Channel Points and predictions**.

---

## 2. Goals

### 2.1 Business / creator goals

- Turn `stream.rodion.pro` into the cleanest entry point for people discovering the stream.
- Increase conversion from passive visitor to active Kick viewer.
- Increase number of people who understand stream mechanics before entering the stream.
- Increase clip consumption and return visits.
- Give Rodion a fast way to publish “today’s angle” without writing a full post.
- Prepare infrastructure for free or cheap multi-streaming via self-hosted Restreamer.

### 2.2 Viewer goals

A viewer landing on the site should understand in under 10 seconds:

- whether Rodion is live right now;
- what game or topic is on stream;
- why the stream is fun;
- how to join chat;
- how Channel Points / predictions / viewer control works;
- what kinds of challenges or rewards are available.

### 2.3 Non-goals

- Do **not** build a fake engagement system.
- Do **not** simulate viewers, followers, chat activity or reactions.
- Do **not** make the website a replacement for Kick chat.
- Do **not** build a giant CMS or overengineered dashboard in v1.
- Do **not** hard-require a strict hour-based schedule.

---

## 3. Product principles

1. **Signal over schedule**  
   Site supports spontaneous streams. It should allow “live now”, “possible tonight”, “surprise stream”, and short pre-stream hype notes.

2. **Kick is source of truth for live interaction**  
   Viewer participation must route back into Kick for chat, rewards and predictions.

3. **The site is a hype machine**  
   The homepage must constantly answer: “why should I join this stream now?”

4. **Rodion’s personality is the product**  
   The design and copy must feel brutal-honest, smart, playful, technical, a bit cyberpunk, but still readable.

5. **Manual override always wins**  
   API sync is great, but Rodion must be able to manually pin clips, override messaging, and set the stream hook instantly.

6. **MVP first, no dead complexity**  
   If a feature depends on unstable scraping or weak platform support, ship a manual fallback first.

---

## 4. Verified platform assumptions to respect in the implementation

These are implementation assumptions Codex should treat as hard constraints:

1. Kick has an official public developer platform with OAuth 2.1, scopes, channel APIs, livestream APIs, chat APIs, channel rewards APIs, and webhook subscriptions.
2. Kick player can be embedded via iframe using `https://player.kick.com/<username>`.
3. Kick Channel Points are tied to the Kick channel, not the website itself.
4. Predictions are available when Channel Points are enabled.
5. Custom rewards are limited to **15 total rewards** per channel.
6. Webhooks must be signature-validated.
7. Kick provides webhook events that are directly useful for this site:
   - `chat.message.sent`
   - `channel.followed`
   - `channel.subscription.new`
   - `channel.subscription.renewal`
   - `channel.subscription.gifts`
   - `channel.reward.redemption.updated`
   - `livestream.status.updated`
   - `livestream.metadata.updated`
8. Kick chat posting is possible through the API, but **public site visitors must never gain direct ability to send messages into Kick chat through the site**.
9. For clips, do **not** assume an official public clips API exists unless Codex verifies one during implementation. MVP must support manual curation of clip URLs.

---

## 5. Target users

### 5.1 Primary

- **Rodion (owner/streamer)**
  - wants quick setup
  - hates rigid scheduling
  - likes intense formats and interactive chaos
  - wants to turn passion into a real audience without fake growth

### 5.2 Secondary

- **Viewer / newcomer**
  - arrives from social link, clip link, site, or friend
  - needs quick context
  - wants an obvious path to interaction

### 5.3 Tertiary

- **Moderator**
  - may help resolve rewards
  - may help track stream events
  - may use site to understand active rules/challenges

---

## 6. Success metrics

### 6.1 Product metrics

- % of site visitors who click through to Kick live page/chat
- % of site visitors who watch at least one featured clip
- number of return visitors to `stream.rodion.pro`
- time on page during live sessions
- clicks on “Open chat on Kick” / “Watch on Kick” / “Follow on Kick” CTA

### 6.2 Stream-facing metrics

- increase in average unique chatters
- increase in followers from sessions with active site promotion
- increase in Channel Point redemptions per stream
- increase in prediction participation per stream
- increase in clip creation/share volume

### 6.3 Anti-metrics

- no fake engagement sources
- no misleading claims that points can be earned or redeemed on the site itself
- no dead or stale “coming soon” sections

---

## 7. Scope

### 7.1 MVP

Build a production-ready website with:

- live/offline detection from Kick;
- embedded Kick player;
- clear CTA to open chat on Kick;
- stream hook / “why join now” module;
- Channel Points explainer;
- predictions explainer;
- rewards board synced from Kick rewards API if available via owner auth;
- featured clips section with manual admin curation;
- stream formats / rubrics section;
- game-specific interactive plan page for **Mass Effect Legendary Edition**;
- live event feed powered by Kick webhooks;
- minimal owner admin panel;
- deployment for `stream.rodion.pro`;
- optional self-hosted Restreamer deployment spec on the same server.

### 7.2 Post-MVP

- automated clip sync if a stable source is confirmed;
- game templates for more titles;
- viewer profiles / loyalty pages;
- notifications / mailing / Telegram hook;
- public archive of past stream sessions;
- auto-generated social post snippets from the admin panel;
- on-site overlays/widgets for OBS.

---

## 8. Information architecture

### 8.1 Public routes

- `/` — main landing / live HQ
- `/game/mass-effect-legendary` — game-specific landing / rules / events
- `/clips` — featured clips archive (manual curated)
- `/formats` — stream rubrics / what happens on stream
- `/about` — Rodion / stream identity / what viewers get
- `/go/kick` — redirect to Kick channel
- `/go/chat` — redirect to Kick channel or popout chat

### 8.2 Private routes

- `/admin` — single-owner dashboard
- `/admin/clips`
- `/admin/stream`
- `/admin/games`
- `/admin/settings`
- `/api/webhooks/kick`

### 8.3 Suggested one-page fallback

If Codex wants to ship faster, MVP can be mostly one-page under `/`, with secondary routes generated later. But the codebase should still be structured for route growth.

---

## 9. UX requirements

### 9.1 Hero section

Must show above the fold:

- stream status badge: `LIVE`, `OFFLINE`, `POSSIBLE TONIGHT`, `SURPRISE STREAM`
- title/subtitle
- current game/category if live
- primary CTA: `Смотреть на Kick`
- secondary CTA: `Открыть чат на Kick`
- short hook: e.g. “Сегодня чат ломает мне прохождение в Mass Effect”
- optional “Start Watching / Join the Event” microcopy

### 9.2 Live player section

- Embed Kick player responsively.
- Desktop: player occupies main visual area.
- Mobile: player full width, sticky CTA block beneath.
- If offline, replace main player focus with:
  - latest featured clip;
  - last stream recap;
  - “next possible session” note if manually set.

### 9.3 Chat CTA section

Because chat interaction must stay on Kick:

- show prominent “Join chat on Kick” button;
- optionally show read-only embedded popout chat if technically stable;
- if embedded chat is unreliable, hide it and keep only external CTA;
- never make embedded chat a dependency for the product.

### 9.4 “How interaction works” section

Explain, in plain Russian:

- viewers earn Channel Points on Kick;
- points unlock custom rewards;
- predictions let viewers bet points on outcomes;
- most chaos is viewer-driven;
- some rewards affect gameplay live.

### 9.5 Rewards board section

Must display:

- active reward title
- cost
- description
- whether user input is required
- example effect
- status badge if paused/disabled

Source:

- primary: Kick rewards API sync
- fallback: manual admin entries

### 9.6 Predictions explainer section

Must display:

- what predictions are
- how they work
- examples specific to current game
- CTA: “Prediction appears in Kick chat during stream”

### 9.7 Formats / rubrics section

This section sells the personality of the channel.

Must include examples such as:

- `Чат ломает мне прохождение`
- `Brutal Honest Review`
- `Технарь в игре`
- `1 стрим = 1 эксперимент`
- `Огненный вечер`

Each card should explain:

- what the format is;
- how viewers participate;
- why it is fun.

### 9.8 Clips section

Must show:

- featured clips with title, game, age, optional view count, thumbnail, duration;
- filtering by tag / game in future-ready structure;
- manual pinning and ordering from admin panel.

### 9.9 Live event feed

A real-time-ish feed on the site showing:

- stream started / ended
- title changed
- recent follows
- recent reward redemptions
- selected recent chat messages

Feed should feel alive but not spammy.

### 9.10 Visual style

Desired style:

- dark / cyber / clean
- modern readable typography
- subtle glow accents, not clown neon overload
- big hierarchy, obvious CTA
- strong live-state colors
- lightweight animation
- good mobile behavior

Tone of copy:

- smart
- playful
- direct
- no fake corporate fluff

---

## 10. Functional requirements

### 10.1 Live status sync

The site must know whether Rodion is live.

#### Requirements

- Poll Kick channel/livestream endpoint on an interval (e.g. 30–60 sec).
- Also accept webhook-driven updates from `livestream.status.updated` and `livestream.metadata.updated`.
- Cache current state server-side.
- Expose a public `/api/public/state` endpoint for the frontend.
- Support manual override in admin:
  - force offline
  - set “possible tonight”
  - set surprise session note

#### Output fields

- isLive
- streamTitle
- categoryName
- startedAt
- endedAt
- viewerCount (if available)
- customTags
- manualStatusMode
- todayHook

### 10.2 Kick player embed

- Use official iframe embed.
- Responsive 16:9 on desktop and mobile.
- Do not autoplay with sound by default.
- Allow optional muted autoplay toggle from admin if later desired.

### 10.3 Rewards sync

#### Viewer-facing

- show current reward list on the site;
- explain which rewards are “serious” vs “chaos”;
- mark those that require text input.

#### Owner-facing

- sync from Kick rewards API;
- store local cache in DB;
- allow manual descriptive label additions for each reward, e.g. “очень токсичная награда”, “хорошо работает в Mass Effect”.

#### Notes

- Do not exceed 15 rewards in design assumptions.
- Respect paused / disabled status.

### 10.4 Reward redemption feed

- Receive reward redemption events via webhook.
- Store status: `pending`, `accepted`, `rejected`.
- Show public feed cards like:
  - “Viewer X triggered: Choose Shepard answer”
  - “Viewer Y triggered: No medigel for 10 minutes”
- Admin can choose which reward types are public vs private.

### 10.5 Chat event feed

- Subscribe to `chat.message.sent` webhooks.
- Persist a rolling buffer of recent messages.
- Show only a filtered subset publicly:
  - max latest 10–20 visible messages;
  - profanity/spam guard;
  - optionally only featured messages.
- This is **not** a full chat replacement.

### 10.6 Follow / sub event feed

- Subscribe to follow/sub events.
- Surface recent support events in a site-side ticker or cards.
- Make the stream feel alive even before visitor clicks into Kick.

### 10.7 Clips management

Because clip ingestion may not be reliably supported through official API docs, MVP clips must be admin-curated.

#### Admin clip entry model

- url
- title
- source platform (`kick`)
- game/category
- duration
- optional view count snapshot
- thumbnail URL
- tags
- sort order
- featured boolean

#### Nice-to-have

Optional parser job that attempts to fetch public clip metadata from the channel clips page. This must be explicitly marked experimental and must not block the site.

### 10.8 Stream hook / event mode

Rodion must be able to set the current stream angle instantly.

Examples:

- “Mass Effect, но чат решает важные выборы”
- “Сегодня жёстко разбираю механику игры как разработчик”
- “Чат ломает мне билд весь вечер”
- “1 стрим = 1 эксперимент: без медигеля”

Admin must be able to set:

- short hook title
- short hook description
- current rubric
- current game
- challenge mode
- pinned CTA text

### 10.9 Game landing pages

The site must support per-game event templates.

MVP required page:

- `/game/mass-effect-legendary`

This page should include:

- short intro to the run
- why this game is fun on stream
- current stream modes relevant to the game
- reward examples
- prediction examples
- clip picks for this game
- “Tonight’s squad rules” block

### 10.10 Admin panel

Must be lightweight and very fast.

Admin features:

- login / protected access
- edit live hook
- set signal state (`offline`, `possible tonight`, `surprise stream`, `live override`)
- feature clips
- manage games and rubrics
- sync Kick channel info
- sync rewards
- see recent webhook events
- hide/show public feed items
- set CTA text
- toggle sections on homepage

### 10.11 Restreamer module (optional but included in deployment spec)

- Deploy open-source Restreamer separately on the same server.
- Protect with Basic Auth or equivalent.
- Keep it out of the public marketing flow.
- The public site can include a small admin-only status note: “Restream active / inactive”.
- Do **not** overload the site app with RTMP logic; keep Restreamer as a separate service.

---

## 11. Content requirements

### 11.1 Homepage copy structure

The homepage must sell these ideas:

- this stream is not passive;
- the chat matters;
- the stream can switch modes fast;
- Rodion reacts, analyzes, improvises;
- joining late is still fine because the site tells you what is happening.

### 11.2 Mandatory copy blocks

1. **What is happening now**
2. **How viewers can influence the stream**
3. **Current rewards**
4. **Prediction examples**
5. **Featured clips**
6. **Formats / rubrics**
7. **About Rodion / stream identity**

---

## 12. Mass Effect Legendary Edition content pack (MVP seed content)

Codex should prefill the site with an initial themed content pack for Mass Effect Legendary Edition.

### 12.1 Page title ideas

- `Mass Effect Legendary — чат решает, как выживает Шепард`
- `Mass Effect Legendary на Kick — решения, челленджи, predictions`
- `Mass Effect Legendary: огненный вечер с живым чатом`

### 12.2 Hero hook examples

- `Mass Effect начат. Чат может сделать из Шепарда героя… или идиота.`
- `Сегодня в Mass Effect: моральные выборы, тупые риски и зрительский саботаж.`
- `Лечиться нельзя? Можно. Но если чат так решит — уже нельзя.`

### 12.3 Reward examples

These are site copy examples and should be configurable from admin.

1. **Выбери ответ Шепарда**  
   Viewer chooses next important dialogue tone.

2. **Без медигеля 10 минут**  
   Temporary restriction challenge.

3. **Иду в рискованную зону сейчас**  
   Viewer forces immediate danger.

4. **Сменить оружие / спек на бой**  
   Temporary loadout sabotage.

5. **Парагон или Ренегат — решает чат**  
   Viewer pushes roleplay direction.

6. **Разбери механику как разработчик**  
   Rodion pauses action and explains design critique.

7. **Горячий тейк по персонажу**  
   Rodion gives a brutal honest character take.

8. **Чат выбирает следующего напарника**  
   Party composition control.

9. **Один бой без укрытий**  
   High-risk fun challenge.

10. **Скажи, что я сделал тупо**  
   Viewer gets an explicit review moment.

### 12.4 Prediction examples

1. `Пройду следующий бой с первой попытки?`
2. `Сдохну до конца миссии?`
3. `Чат заставит меня выбрать плохой ответ?`
4. `Найду нормальный лут до конца часа?`
5. `Этот напарник переживёт миссию?`
6. `Саботажный билд сработает или нет?`
7. `Пойду по Парагону или Ренегату в этой сцене?`
8. `Босс сломает меня за 3 попытки?`

### 12.5 Stream format examples for this game

- **Чат ломает мне Mass Effect**
- **Шепард под управлением аудитории**
- **Mass Effect глазами разработчика**
- **Один вечер — один эксперимент**

### 12.6 Suggested explainer text

> Здесь не просто прохождение. Зрители влияют на решения, челленджи и темп стрима. Если хочешь не просто смотреть, а вмешиваться — заходи в чат Kick и копи Channel Points.

---

## 13. Backend architecture

### 13.1 Suggested stack

To align with Rodion’s usual stack and reduce context switching:

- **Frontend:** React + TypeScript + Vite
- **UI:** Tailwind CSS + shadcn/ui
- **Backend:** Node.js + Express + TypeScript
- **DB:** PostgreSQL + Drizzle ORM
- **Runtime:** PM2
- **Reverse proxy:** Nginx
- **Optional restream service:** Restreamer via Docker Compose

Alternative acceptable stack:

- Next.js App Router + PostgreSQL + Drizzle

But if Codex chooses an alternative, it must justify why it is better for SSR, deployment simplicity, and admin speed.

### 13.2 Suggested app structure

- `/apps/stream-site` or standalone repo
- `/src/frontend`
- `/src/server`
- `/src/shared`
- `/src/server/integrations/kick`
- `/src/server/routes/public`
- `/src/server/routes/admin`
- `/src/server/routes/webhooks`
- `/src/server/db`
- `/src/server/jobs`

### 13.3 Data model (minimum)

#### `site_settings`
- id
- site_title
- site_subtitle
- primary_cta_text
- secondary_cta_text
- current_status_mode
- current_hook_title
- current_hook_description
- current_game_slug
- current_format_slug
- updated_at

#### `games`
- id
- slug
- title
- short_description
- long_description
- hero_copy
- is_active
- created_at
- updated_at

#### `formats`
- id
- slug
- title
- description
- participation_rules
- is_active

#### `featured_clips`
- id
- url
- title
- game_slug
- duration_seconds
- thumbnail_url
- view_count_snapshot
- published_label
- tags jsonb
- is_featured
- sort_order
- created_at
- updated_at

#### `reward_cache`
- id
- kick_reward_id
- title
- description
- cost
- background_color
- is_enabled
- is_paused
- is_user_input_required
- skip_queue
- note_for_site
- updated_at

#### `reward_events`
- id
- kick_redemption_id
- kick_reward_id
- reward_title
- redeemer_user_id
- redeemer_username nullable
- user_input nullable
- status
- redeemed_at
- is_public
- created_at

#### `stream_sessions`
- id
- kick_session_key nullable
- title
- category_name
- started_at
- ended_at nullable
- is_live
- viewer_count_peak nullable
- created_at
- updated_at

#### `site_feed_events`
- id
- source_type (`follow`, `sub`, `reward`, `chat`, `status`, `metadata`)
- source_event_id
- title
- body jsonb
- is_public
- created_at

#### `webhook_events_raw`
- id
- kick_message_id
- kick_subscription_id
- kick_event_type
- kick_event_version
- payload jsonb
- received_at
- processed_at nullable

#### `admin_sessions` or equivalent auth table

---

## 14. Internal API requirements

### Public API

#### `GET /api/public/state`
Returns current homepage state.

#### `GET /api/public/rewards`
Returns active reward list.

#### `GET /api/public/feed`
Returns recent public events.

#### `GET /api/public/clips`
Returns featured clips.

#### `GET /api/public/games/:slug`
Returns public game landing data.

### Admin API

#### `POST /api/admin/login`

#### `POST /api/admin/state`
Update hook, mode, CTA, current game, current format.

#### `POST /api/admin/clips`
Create clip.

#### `PATCH /api/admin/clips/:id`
Update clip.

#### `DELETE /api/admin/clips/:id`
Delete clip.

#### `POST /api/admin/sync/kick-channel`
Sync channel/livestream state now.

#### `POST /api/admin/sync/kick-rewards`
Sync rewards now.

#### `GET /api/admin/webhooks/events`
Inspect recent processed events.

### Webhook API

#### `POST /api/webhooks/kick`

Responsibilities:

- validate Kick signature;
- reject invalid requests;
- store raw payload;
- process supported event types;
- ensure idempotency using `Kick-Event-Message-Id`.

---

## 15. Kick integration requirements

### 15.1 Auth model

Implement Kick app registration support using env variables:

- `KICK_CLIENT_ID`
- `KICK_CLIENT_SECRET`
- `KICK_REDIRECT_URI`
- `KICK_WEBHOOK_SECRET` if needed by implementation abstraction

Use:

- app access token where sufficient for public reads;
- user access token for owner-specific operations such as reward management and any actions requiring user authorization.

### 15.2 Requested scopes

Codex should request only the scopes needed for this product.

Required / recommended:

- `channel:read`
- `channel:rewards:read`
- `events:subscribe`

Optional but useful:

- `channel:rewards:write`
- `channel:write`
- `chat:write`
- `streamkey:read` (only if integrating helper tooling around stream setup; not required for MVP site)

### 15.3 Kick API usage plan

#### Channel sync
Use channels endpoint by slug to fetch:
- slug
- description
- category
- stream data
- viewer count
- title

#### Livestream sync
Use livestream endpoint for current live data and possible future browsing features.

#### Rewards sync
Use channel rewards endpoint and persist local cache.

#### Reward event updates
Use `channel.reward.redemption.updated` webhook to enrich feed.

#### Chat event updates
Use `chat.message.sent` webhook to surface a controlled feed.

#### Live status updates
Use `livestream.status.updated` webhook to reduce polling lag.

### 15.4 Chat sending policy

The backend may optionally support sending **owner-controlled** or **bot-controlled** messages into Kick chat for operational tasks later, but this is explicitly **not** a public site feature.

Examples of allowed future use:

- post “site updated” message manually from admin;
- announce event mode from admin;
- post a clip link intentionally.

Examples not allowed:

- anonymous visitor chat posting;
- fake engagement botting;
- automated spam loops.

---

## 16. Webhook processing requirements

Supported event types in MVP:

- `chat.message.sent`
- `channel.followed`
- `channel.subscription.new`
- `channel.subscription.renewal`
- `channel.subscription.gifts`
- `channel.reward.redemption.updated`
- `livestream.status.updated`
- `livestream.metadata.updated`

### Processing rules

- validate signature before parsing;
- dedupe via message ID;
- store raw payload;
- map to normalized internal event model;
- mark whether event is public;
- trim retained public feed size to avoid DB bloat;
- avoid exposing sensitive/internal-only event details.

### Public event formatting examples

- `Rodion вышел в эфир`
- `Новый фолловер: {name}`
- `Награда активирована: {rewardTitle}`
- `Чат в огне: {message excerpt}`
- `Название стрима обновлено`

---

## 17. Restreamer infrastructure spec

This is separate from the site app but part of the overall project delivery.

### 17.1 Goal

Provide free / low-cost restreaming infra on Rodion’s own server so he can later stream to Kick + another platform without paying recurring SaaS fees.

### 17.2 Deployment mode

- Docker Compose service
- internal or protected subdomain, e.g. `restream.rodion.pro`
- Basic Auth / access restriction required

### 17.3 Requirements

- document installation and restart procedure;
- persist config volume;
- expose only what is necessary;
- provide a short README for Rodion with:
  - how to add publication targets;
  - how to connect Kick target;
  - how to start/stop service;
  - how to secure it.

### 17.4 Out of scope

- no need to build a custom restream control UI inside the public website;
- a simple admin status badge is enough.

---

## 18. SEO / discoverability requirements

Even though the core growth will come from links/clips/social posts, the site should still be indexable.

Requirements:

- proper title/meta/og tags
- game page metadata
- stream status in title if live (optional but desirable)
- readable URLs
- JSON-LD optional
- social preview image

Suggested titles:

- `WizardJIOCb — live streams, clips, chat chaos`
- `Mass Effect Legendary stream — интерактивный стрим WizardJIOCb`

---

## 19. Admin UX requirements

Admin UX must be designed for speed.

### 19.1 “Go live signal” panel

One compact panel with buttons:

- `LIVE`
- `POSSIBLE TONIGHT`
- `SURPRISE STREAM`
- `OFFLINE`

Fields:

- hook title
- hook description
- current game
- current format
- CTA text
- pin featured clip

### 19.2 Rewards sync panel

- list latest synced rewards
- show active / paused / disabled
- attach site note to each reward
- one-click refresh sync

### 19.3 Feed moderation panel

- hide a chat message from public site feed
- hide a redemption from public site feed
- pin an event

---

## 20. Security requirements

- All secrets in environment variables.
- Webhook signature validation mandatory.
- Idempotent webhook processing mandatory.
- Admin routes protected.
- Rate-limit public endpoints where sensible.
- Sanitize all displayed user-provided content from chat/reward input.
- Escape HTML and avoid XSS vectors in site feed rendering.
- Log auth failures.
- Do not expose Kick tokens to frontend.

---

## 21. Performance requirements

- homepage loads fast even offline;
- critical public endpoints should be cached;
- ISR/SSR/server caching acceptable;
- frontend should not depend on many live network waterfalls;
- event feed updates can be polling or SSE/WebSocket, but keep MVP simple if needed.

Target:

- fast first load on desktop and mobile
- no huge JS bundle for a relatively simple site

---

## 22. Analytics requirements

Implement lightweight analytics for site actions:

Track:

- CTA click to Kick
- CTA click to chat
- clip open
- reward board interactions
- game page visits
- live session page dwell time

Use simple privacy-respectful analytics or custom DB events.

---

## 23. Deployment requirements

### 23.1 Server assumptions

Target server is Rodion’s existing Linux server.

Suggested deployment paths:

- app root: `/var/www/stream.rodion.pro`
- logs: `/var/log/stream.rodion.pro`
- restreamer: Docker Compose folder under `/opt/restreamer` or `/var/www/restreamer`

### 23.2 Nginx

Create vhost for `stream.rodion.pro` with HTTPS and reverse proxy to app port.

Suggested app port:

- `127.0.0.1:3012`

### 23.3 PM2

Provide PM2 ecosystem config for the site app.

### 23.4 Env setup

Provide `.env.example` with all required keys.

### 23.5 Deliverables for deployment

Codex must provide:

- codebase
- README
- `.env.example`
- SQL migrations / Drizzle schema
- PM2 config
- Nginx config example
- webhook setup instructions
- Kick OAuth setup instructions
- Restreamer Docker Compose example

---

## 24. MVP acceptance criteria

The work is accepted when:

1. `stream.rodion.pro` opens and shows a polished homepage.
2. Site can show live/offline state based on Kick sync.
3. Embedded Kick player works.
4. “Open chat on Kick” CTA works.
5. Site contains a clear explainer of Channel Points and predictions.
6. Site displays a reward board, ideally synced from Kick.
7. Site displays featured clips from admin-managed entries.
8. Site contains a working Mass Effect Legendary page with seeded content.
9. Site can receive and validate Kick webhooks.
10. Site can show a recent public event feed.
11. Admin can change hook/status without code edits.
12. Deployment docs are complete enough for Rodion to run the project himself.
13. Optional Restreamer deployment guide/service is included.

---

## 25. Recommended implementation order

### Phase 1 — Core site shell
- project bootstrap
- homepage
- live/offline state model
- player embed
- CTA buttons
- admin auth
- admin state editor

### Phase 2 — Kick integration
- OAuth app setup
- channel sync
- livestream sync
- rewards sync
- DB cache

### Phase 3 — Interactivity & content
- formats section
- rewards board
- predictions explainer
- Mass Effect page
- clips section + admin curation

### Phase 4 — Webhooks
- webhook endpoint
- signature validation
- event normalization
- public event feed

### Phase 5 — Ops polish
- PM2
- Nginx
- logging
- README
- Restreamer compose

---

## 26. Direct instructions to Codex

Build this as a **real production-ready streaming hub**, not a demo landing page.

Important decisions Codex must follow:

- optimize for spontaneity, not rigid schedule culture;
- keep Kick as the interaction source of truth;
- do not fake or simulate community activity;
- use manual fallbacks where API support is weak or uncertain;
- make the admin flow extremely fast;
- make the site feel alive during streams and still useful when offline;
- prefill the product with a strong Mass Effect Legendary interactive example;
- write clean code and clear deployment docs.

