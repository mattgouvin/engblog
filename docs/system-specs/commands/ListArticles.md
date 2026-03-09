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

**Sources** `--sources` (optional, default: all)
Filter which source types to include. Accepts one or both of: `companies`, `community`. Omitting this flag fetches from all sources.

- `--sources companies` — fetch only company blogs
- `--sources community` — fetch only independent sources
- `--sources companies community` — fetch all (same as default)

Constraints:
- `--sources community` and `--companies` are mutually exclusive (exits non-zero)
- Unrecognized values exit non-zero with a list of valid values

**Help** `--help, -h`
Display usage information and available options.

## Filtering Behavior

Articles with a null `publishedAt` are always excluded from results, regardless of whether a date range was specified. This applies to all sources.

## Output Format

Results are returned as a JSON array. Each article object contains:
- `title` — article title
- `url` — article URL
- `publishedAt` — publication date (ISO string or null)
- `source` — slug identifying the source (e.g. `"google"`, `"latentspace"`)
- `sourceType` — `"company"` or `"independent"`

## Supported Sources

28 tech company blogs including Google, Meta, Netflix, Stripe, Anthropic, and others. Independent sources: Latent Space (`latentspace`).

## Common Use Cases

- Monitor recent engineering posts from specific companies
- Filter for AI/ML related content across multiple sources
- Track articles published within specific date ranges
- Exclude certain topics while browsing company blogs
