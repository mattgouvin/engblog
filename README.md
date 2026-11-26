# Engineering Blog Discovery

CLI tool for discovering and filtering engineering blog articles from tech companies.

## Quick Start

```bash
make install
make run ARGS="--companies google meta --daysBack 7"
```

Run `make` to list all targets. Run `make check` (lint, typecheck, and test) before opening a PR.


## Sources

Most providers read each company's official RSS or Atom feed. Asana has no working feed, so its provider fetches the engineering-spotlight page and parses the article cards from the HTML.

Anthropic and Cursor read community feeds from [[Olshansk/rss-feeds](https://github.com/Olshansk/rss-feeds)]:

- **Anthropic:** Anthropic publishes no engineering feed, and its engineering page loads the article list with JavaScript. The [[community feed](https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_anthropic_engineering.xml)] links to `/research/` URLs because Anthropic redirects `/engineering/<slug>` there.
- **Cursor:** The official `cursor.com/atom.xml` feed stopped updating in November 2024. The [[community feed](https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_cursor.xml)] scrapes `cursor.com/blog` instead.

One maintainer runs both feeds. When their scraper breaks, the feed stops updating without an error, and the CLI returns no new posts for that company. Check the feed's `lastBuildDate` when a company goes quiet.
