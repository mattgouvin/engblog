# List Articles Functionality

`list-articles` is the primary command for fetching and filtering engineering blog articles from supported tech companies.

## Command Flags

**Companies** `--companies, -c` (optional, default: all)
Specify which companies to fetch articles from. Omitting this flag fetches from all supported companies. Multiple companies can be requested at once using space-separated slugs.

**Date Filters**
Control the time range of articles to fetch:
- `--daysBack, -d` — fetch articles from the last N days
- `--startDate, -s` / `--endDate, -e` — absolute date range (both must be provided together, format: YYYY-MM-DD)

Note: `--daysBack` and `--startDate`/`--endDate` are mutually exclusive.

**Content Filters**
Filter articles by content keywords matched against article titles:
- `--include, -i` — return only articles matching the filter
- `--exclude, -x` — omit articles matching the filter
- Both flags can be specified multiple times to apply multiple filters
- Available filters: `ai`

Note: The same filter cannot be used in both `--include` and `--exclude` simultaneously.

**Help** `--help, -h`
Display usage information and available options.

## Output Format

Results are returned as JSON array containing article objects with title, URL, publication date, and source company.

## Supported Companies

28 tech companies including Google, Meta, Netflix, Stripe, Anthropic, and others.

## Common Use Cases

- Monitor recent engineering posts from specific companies
- Filter for AI/ML related content across multiple sources
- Track articles published within specific date ranges
- Exclude certain topics while browsing company blogs
