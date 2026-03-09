# Community Source Registry

## User Story
As an engineer using engblog, I want independent sources (independent blogs, newsletters, individual contributors) to be fetched automatically alongside company blogs so that I get a richer view of the engineering landscape without extra configuration.

## Context
The system uses a provider registry (`src/providers/registry.ts`) that maps `Company` enum values to provider instances. The repository layer (`src/dao/provider-article-repository.ts`) iterates this registry to fetch articles and uses `src/dao/cache.ts` for per-source caching. A parallel registry and enum for independent sources needs to be introduced, with the repository fetching from both by default. The article output contract changes in this task: `company` is renamed to `source` and a `sourceType` discriminator is added.

## Requirements (EARS)

### Functional
- The system shall define an `IndependentSource` enum distinct from the `Company` enum.
- The system shall maintain an independent source registry mapping each `IndependentSource` value to a provider instance.
- When the repository fetches articles, it shall fetch from all registered independent sources in addition to all requested companies.
- When Latent Space is registered as an independent source with RSS feed `https://www.latent.space/feed.xml`, the system shall fetch and return its articles.
- The system shall set `source` to the source slug and `sourceType` to `"independent"` on all articles returned from independent sources.
- The system shall set `source` to the company slug and `sourceType` to `"company"` on all articles returned from company sources.
- The system shall not include a `company` field in any article output.
- Independent source articles shall participate in per-source caching (`src/dao/cache.ts`) using the same mechanism as company sources.
- Content filters (`--include`, `--exclude`) shall apply to independent source articles using the same logic applied to company articles.

### Constraints
- The system shall not modify the existing `Company` enum or company provider registry.
- The system shall not break existing behavior when no independent sources are registered or available.
- Independent source fetching shall execute in parallel with company fetching, not sequentially.

## Acceptance Criteria

### Scenario: Latent Space articles returned in default fetch
**Given** Latent Space is registered in the independent source registry
**When** `list-articles --daysBack 30` is run with no source filters
**Then** the output includes at least one article with `source: "latentspace"` and `sourceType: "independent"`
**And** the article has a non-empty `title`, `url`, and `date`

### Scenario: Company articles use renamed source field and sourceType
**Given** a company source (e.g. Stripe) is registered
**When** `list-articles --daysBack 7` is run
**Then** Stripe articles have `source: "stripe"` and `sourceType: "company"`
**And** no article in the output has a `company` field

### Scenario: Independent source articles are fetched in parallel with company articles
**Given** both company sources and independent sources are registered
**When** `list-articles --daysBack 7` is run
**Then** articles from both companies and independent sources appear in a single merged result set
**And** results are sorted by date descending regardless of source type

### Scenario: Content filter applies to independent source articles
**Given** Latent Space has articles both matching and not matching an AI content filter
**When** `list-articles --daysBack 30 --include ai` is run
**Then** only AI-related articles appear, regardless of whether their `sourceType` is `"company"` or `"independent"`

### Scenario: Independent source results are cached
**Given** `list-articles --daysBack 7` has been run once and Latent Space results are cached
**When** `list-articles --daysBack 7` is run again
**Then** Latent Space articles are returned from cache without a network request

### Scenario: RSS feed unavailable for an independent source
**Given** the Latent Space RSS feed returns a network error
**When** `list-articles --daysBack 7` is run
**Then** the command does not crash
**And** articles from other sources are still returned
**And** no articles with `source: "latentspace"` appear in the output

## Out of Scope
- CLI flag to control independent source inclusion (covered in 02-CommunityFlag.md)
- Per-source selection (e.g. `--community latentspace`); all registered sources are fetched
- Adding independent sources beyond Latent Space
