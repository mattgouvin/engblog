# Extending the System

## Source Types

Three provider types are available for both company and independent sources.

**RSS Feed Sources**
Most sources are added by configuring an RSS provider with the feed URL.
- `src/providers/rss-provider.ts` — RSS provider implementation

**Browser-Rendered Sources**
For sites requiring JavaScript execution, use a browser provider with CSS selectors to extract article data. Configure selectors for article containers, titles, links, and optional publish dates. Requires Playwright and a Chromium installation.
- `src/types/index.ts` — `HtmlSelectors` interface for selector shape
- `src/providers/browser-provider.ts` — browser provider implementation (uses Playwright/Chromium)

**Custom Sources**
When standard providers don't fit, create a custom provider implementing the base interface. Custom providers handle unique parsing requirements or complex API interactions.
- `src/providers/base-provider.ts` — base class to extend
- `src/providers/asana-provider.ts`, `src/providers/ramp-provider.ts` — reference implementations

Note: Providers fetch article data without source context. The repository layer assigns `source` and `sourceType` automatically when data is retrieved.

## Adding Company Sources

Company blogs are tracked via the `Company` enum and `providerRegistry`.
- `src/types/index.ts` — add entry to `Company` enum
- `src/providers/company-registry.ts` — map the new value to a provider instance (see Source Types above)

## Adding Independent Sources

Independent sources (e.g. community blogs, newsletters) are tracked separately from company blogs via the `IndependentSource` enum and `communityRegistry`.
- `src/types/index.ts` — add entry to `IndependentSource` enum
- `src/providers/community-registry.ts` — map the new value to a provider instance (see Source Types above); `src/providers/community-registry.ts` itself (with `LatentSpace`) serves as the reference implementation
- Articles from independent sources are assigned `sourceType: "independent"` automatically by the repository layer.

## Adding Content Filters

**Keyword-Based Filters**
Define a filter identifier and associate it with a keyword list. The system matches articles containing any of the specified keywords in their title.
- `src/constants/filters.ts` — add entry to `ContentFilterIdentifier` enum
- `src/constants/ai-keywords.ts` — reference keyword list
- `src/filters/keywords.ts` — keyword filter implementation
- `src/filters/registry.ts` — map identifier to filter instance

**Custom Filter Logic**
Implement the filter interface for complex matching rules beyond keyword matching. Custom filters can analyze any article properties and apply arbitrary logic.
- `src/filters/filter.ts` — filter interface to implement
- `src/filters/registry.ts` — map identifier to filter instance

Filters are registered centrally and can be used in include or exclude mode during article queries.

## Adding Commands

New CLI commands follow a standard pattern:
1. Define the command identifier
2. Create a handler function that accepts parsed flags
3. Register the command in the main routing logic

Commands should delegate data access to the repository layer rather than directly interacting with data sources.
- `src/constants/commands.ts` — add entry to `CliCommand` enum
- `src/cli/handler.ts` — add handler function
- `src/cli/parser.ts` — register command in routing logic
- `src/cli/messages.ts` — add help text for the new command

## Adding CLI Flags

New flags require:
1. Flag identifier and optional short form
2. Parser/processor to validate and extract flag values
3. Integration into the main argument parser
4. Type definition for the parsed flag value

Flag processors handle validation and conversion of raw string arguments into typed values. Each processor must implement the `FlagProcessor<T>` interface.
- `src/cli/flags/definitions.ts` — add `CliFlag` entry
- `src/cli/flags/` — add processor implementing `FlagProcessor<T>` (see `companies.ts`, `date.ts`, `filter.ts` as reference); simple multi-value flags like `--sources` can be parsed inline in `parser.ts` without a separate processor file
- `src/cli/parser.ts` — integrate into argument parsing and `validateFlags`
- `src/types/cli.ts` — `FlagProcessor<T>` and `FlagProcessorResult<T>` interfaces; update `ParsedFlags` type
- `src/constants/` — add a constants file for new enum values (e.g. `src/constants/sources.ts` for `SourceType`); export from `src/constants/index.ts`
- `src/cli/messages.ts` — add error messages for invalid flag values

## Swapping Data Sources

Replace the repository implementation to change the underlying data source:

**Database-Backed Repository**
Query a database (DynamoDB, PostgreSQL, etc.) instead of fetching from external APIs. The repository interface remains the same while the implementation changes completely.

**Service API Repository**
Connect to an internal service API that manages blog data. Translate filter parameters to API calls and convert responses to the standard article format.

The repository pattern ensures the command layer remains unchanged regardless of the data source.
- `src/dao/article-repository.ts` — repository interface to implement
- `src/dao/provider-article-repository.ts` — existing implementation for reference
- `src/dao/cache.ts` — per-source file cache keyed by source slug string (1-hour TTL, stored in OS tmpdir); covers both company and independent sources; bypass or replace as needed for non-provider-based implementations
