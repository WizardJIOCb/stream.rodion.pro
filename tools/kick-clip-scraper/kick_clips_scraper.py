#!/usr/bin/env python3
from __future__ import annotations

import argparse
import asyncio
import json
import re
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

from playwright.async_api import TimeoutError as PlaywrightTimeoutError
from playwright.async_api import async_playwright


TIME_RE = re.compile(r"^\d{1,2}:\d{2}(?::\d{2})?$")
VIEWS_RE = re.compile(r"^(\d[\d,\s.]*)\s+views?$", re.IGNORECASE)
CLIP_ID_RE = re.compile(r"(clip_[A-Za-z0-9]+)")


@dataclass
class ClipItem:
    clip_id: str
    clip_url: str
    title: str | None
    thumbnail_url: str
    duration_text: str | None
    duration_seconds: int | None
    views_text: str | None
    views_count: int | None
    category: str | None
    relative_age: str | None
    channel: str
    source_page: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Scrape Kick clips into JSON using Playwright (Windows/Linux compatible)."
    )
    parser.add_argument("--channel", default="wizardjiocb", help="Kick channel slug, e.g. wizardjiocb")
    parser.add_argument("--url", default=None, help="Optional full clips page URL. Default is built from --channel.")
    parser.add_argument("-o", "--output", default=None, help="Output JSON file path. Defaults to <channel>_clips.json")
    parser.add_argument("--sort", default="view", choices=["view", "recent"], help="Kick sorting mode")
    parser.add_argument("--range", dest="time_range", default="all", help="Kick range filter, e.g. all / week / month")
    parser.add_argument("--headful", action="store_true", help="Run browser with UI visible")
    parser.add_argument("--max-scrolls", type=int, default=60, help="Maximum scroll iterations")
    parser.add_argument("--scroll-delay-ms", type=int, default=1200, help="Delay after each scroll in ms")
    parser.add_argument("--timeout-ms", type=int, default=60000, help="Navigation timeout in ms")
    return parser.parse_args()


def build_url(channel: str, sort: str, time_range: str) -> str:
    return f"https://kick.com/{channel}/clips?sort={sort}&range={time_range}"


def duration_to_seconds(value: str | None) -> int | None:
    if not value:
        return None
    parts = [int(x) for x in value.split(":")]
    if len(parts) == 2:
        mm, ss = parts
        return mm * 60 + ss
    if len(parts) == 3:
        hh, mm, ss = parts
        return hh * 3600 + mm * 60 + ss
    return None


def safe_int_from_views(value: str | None) -> int | None:
    if not value:
        return None
    match = VIEWS_RE.match(value.strip())
    if not match:
        return None
    digits = re.sub(r"[^\d]", "", match.group(1))
    return int(digits) if digits else None


def normalize_channel_from_url(url: str, fallback: str) -> str:
    try:
        parsed = urlparse(url)
        parts = [p for p in parsed.path.split("/") if p]
        if parts:
            return parts[0]
    except Exception:
        pass
    return fallback


SCRAPE_JS = r"""
(channel) => {
  const clipThumbSelector = 'img[src*="clips.kick.com/clips/"]';
  const thumbNodes = Array.from(document.querySelectorAll(clipThumbSelector));

  const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
  const timeRe = /^\d{1,2}:\d{2}(?::\d{2})?$/;
  const viewsRe = /^\d[\d,\s.]*\s+views?$/i;
  const ageRe = /^(?:·\s*)?\d+\s+(?:second|minute|hour|day|week|month|year)s?\s+ago$/i;
  const clipIdRe = /(clip_[A-Za-z0-9]+)/;

  function uniqueLinesFromText(text) {
    const lines = String(text || '')
      .split('\n')
      .map((x) => clean(x))
      .filter(Boolean);

    const out = [];
    for (const line of lines) {
      if (out[out.length - 1] !== line) out.push(line);
    }
    return out;
  }

  function isProbablyMeta(line) {
    if (!line) return true;
    const lower = line.toLowerCase();
    return (
      timeRe.test(line) ||
      viewsRe.test(line) ||
      ageRe.test(line) ||
      lower === channel.toLowerCase() ||
      lower === 'chat' ||
      lower === 'sort by:' ||
      lower === 'filter by:' ||
      lower === 'follow' ||
      lower === 'offline' ||
      lower === 'stream videos' ||
      lower === 'popular clips' ||
      lower === 'recently streamed categories' ||
      lower.includes('followers')
    );
  }

  function findCardRoot(img) {
    let el = img;
    let best = img.parentElement || img;

    while (el && el !== document.body) {
      const thumbs = el.querySelectorAll(clipThumbSelector).length;
      const txt = clean(el.innerText || '');

      if (thumbs > 1) break;
      if (thumbs === 1 && /views?/i.test(txt) && /\d{1,2}:\d{2}/.test(txt)) {
        best = el;
      }
      el = el.parentElement;
    }

    return best;
  }

  function deriveMeta(lines) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes(' · ')) {
        const [category, relativeAge] = line.split(' · ', 2).map(clean);
        return { category: category || null, relative_age: relativeAge || null };
      }
      if (ageRe.test(line) && i > 0) {
        const prev = lines[i - 1];
        if (!isProbablyMeta(prev)) {
          return { category: prev || null, relative_age: line.replace(/^·\s*/, '') || null };
        }
      }
    }
    return { category: null, relative_age: null };
  }

  function deriveTitle(lines, meta) {
    const lowerChannel = channel.toLowerCase();
    const viewsIdx = lines.findIndex((x) => viewsRe.test(x));
    const channelIdx = lines.findIndex((x) => x.toLowerCase() === lowerChannel);
    const blocked = new Set([meta.category, meta.relative_age].filter(Boolean));

    if (viewsIdx !== -1) {
      const end = channelIdx !== -1 ? channelIdx : lines.length;
      for (let i = viewsIdx + 1; i < end; i++) {
        const line = lines[i];
        if (!line || blocked.has(line) || isProbablyMeta(line)) continue;
        return line;
      }
    }

    if (channelIdx > 0) {
      for (let i = channelIdx - 1; i >= 0; i--) {
        const line = lines[i];
        if (!line || blocked.has(line) || isProbablyMeta(line)) continue;
        return line;
      }
    }

    const candidates = lines.filter((line) => !blocked.has(line) && !isProbablyMeta(line));
    return candidates[0] || null;
  }

  function getClipUrl(root, channel, clipId) {
    const anchors = Array.from(new Set([
      ...(root ? Array.from(root.querySelectorAll('a[href]')) : []),
      ...(root && root.closest('a[href]') ? [root.closest('a[href]')] : []),
    ].filter(Boolean)));

    for (const a of anchors) {
      const href = a.href || '';
      if (href.includes(`/clips/${clipId}`)) return href;
    }
    return `https://kick.com/${channel}/clips/${clipId}`;
  }

  const results = [];
  const seen = new Set();

  for (const img of thumbNodes) {
    const thumbnailUrl = img.currentSrc || img.src || '';
    const clipMatch = thumbnailUrl.match(clipIdRe);
    if (!clipMatch) continue;

    const clipId = clipMatch[1];
    if (seen.has(clipId)) continue;
    seen.add(clipId);

    const root = findCardRoot(img);
    const lines = uniqueLinesFromText(root ? root.innerText : '');
    const durationText = lines.find((x) => timeRe.test(x)) || null;
    const viewsText = lines.find((x) => viewsRe.test(x)) || null;
    const meta = deriveMeta(lines);

    let titleFromAttr = clean(img.getAttribute('alt') || img.getAttribute('title') || '');
    if (titleFromAttr.toLowerCase() === channel.toLowerCase()) {
      titleFromAttr = '';
    }

    const title = deriveTitle(lines, meta) || titleFromAttr || null;
    const clipUrl = getClipUrl(root, channel, clipId);

    if (!thumbnailUrl || !clipId) continue;
    if (!title && !viewsText && !durationText) continue;

    results.push({
      clip_id: clipId,
      clip_url: clipUrl,
      title,
      thumbnail_url: thumbnailUrl,
      duration_text: durationText,
      views_text: viewsText,
      category: meta.category,
      relative_age: meta.relative_age,
      channel,
      debug_lines: lines,
    });
  }

  return results;
}
"""


async def scrape(args: argparse.Namespace) -> dict[str, Any]:
    channel = args.channel.strip().lstrip("@").lower()
    source_url = args.url or build_url(channel, args.sort, args.time_range)
    normalized_channel = normalize_channel_from_url(source_url, channel)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=not args.headful)
        context = await browser.new_context(
            viewport={"width": 1440, "height": 2200},
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            locale="en-US",
        )
        page = await context.new_page()
        page.set_default_timeout(args.timeout_ms)

        try:
            await page.goto(source_url, wait_until="domcontentloaded", timeout=args.timeout_ms)
            await page.wait_for_timeout(2500)
        except PlaywrightTimeoutError:
            print("[warn] Navigation timed out; continuing with whatever loaded so far.")

        previous_count = -1
        stable_rounds = 0
        last_height = 0

        for scroll_idx in range(args.max_scrolls):
            items = await page.evaluate(SCRAPE_JS, normalized_channel)
            current_count = len(items)
            print(f"[info] scroll={scroll_idx:02d} clips_found={current_count}")

            if current_count == previous_count:
                stable_rounds += 1
            else:
                stable_rounds = 0
            previous_count = current_count

            height = await page.evaluate("document.body.scrollHeight")
            if stable_rounds >= 3 and height == last_height:
                break
            last_height = height

            await page.mouse.wheel(0, 4000)
            await page.wait_for_timeout(args.scroll_delay_ms)

        raw_items = await page.evaluate(SCRAPE_JS, normalized_channel)
        await context.close()
        await browser.close()

    deduped: dict[str, ClipItem] = {}
    for item in raw_items:
        clip_id = item.get("clip_id")
        if not clip_id:
            thumb = item.get("thumbnail_url") or ""
            match = CLIP_ID_RE.search(thumb)
            if not match:
                continue
            clip_id = match.group(1)

        thumbnail_url = item.get("thumbnail_url") or ""
        clip_url = item.get("clip_url") or f"https://kick.com/{normalized_channel}/clips/{clip_id}"
        title = item.get("title")
        if isinstance(title, str) and title.strip().lower() == normalized_channel.lower():
            title = None

        record = ClipItem(
            clip_id=clip_id,
            clip_url=clip_url,
            title=title,
            thumbnail_url=thumbnail_url,
            duration_text=item.get("duration_text"),
            duration_seconds=duration_to_seconds(item.get("duration_text")),
            views_text=item.get("views_text"),
            views_count=safe_int_from_views(item.get("views_text")),
            category=item.get("category"),
            relative_age=item.get("relative_age"),
            channel=normalized_channel,
            source_page=source_url,
        )
        deduped[record.clip_id] = record

    clips = list(deduped.values())
    clips.sort(key=lambda x: ((x.views_count or -1), x.clip_id), reverse=True)

    return {
        "channel": normalized_channel,
        "source_page": source_url,
        "count": len(clips),
        "clips": [asdict(x) for x in clips],
    }


async def async_main() -> int:
    args = parse_args()
    output = Path(args.output or f"{args.channel.lower()}_clips.json")
    data = await scrape(args)
    output.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[done] Saved {data['count']} clips to {output}")
    return 0


def main() -> int:
    return asyncio.run(async_main())


if __name__ == "__main__":
    raise SystemExit(main())
