# Overview

CLI tool for discovering engineering blog articles from tech companies.

## System Overview

The system follows a layered structure where each layer has clear responsibilities and well-defined interfaces. Data flows from user input through parsing, command handling, data access, and finally to output.

## Core Layers

**Constants Layer**
Defines shared enumerations and identifier lists used across layers.
- `src/constants/commands.ts` — `CliCommand` enum (e.g. `list-articles`)
- `src/constants/filters.ts` — `ContentFilterIdentifier` enum and `VALID_FILTERS` list
- `src/constants/sources.ts` — `SourceType` enum (`companies`, `community`)
- `src/constants/ai-keywords.ts` — AI/ML keyword list used by the keyword filter

**CLI Layer**
Handles command-line argument parsing and validation. Converts raw string arguments into structured flags and options. Validates mutually exclusive options and ensures data integrity before passing to command handlers.
- `src/cli/parser.ts` — main argument parser
- `src/cli/flags/definitions.ts` — `CliFlag` class with static instances for each flag (long and short forms)
- `src/cli/flags/companies.ts`, `src/cli/flags/date.ts`, `src/cli/flags/filter.ts` — per-flag processors

**Command Layer**
Contains business logic for each CLI command. Currently supports listing articles with various filter options. Commands orchestrate work by delegating to the repository layer rather than directly accessing data sources.
- `src/cli/handler.ts` — command handlers

**Repository Layer**
Provides a unified interface for data access regardless of the underlying data source. The current implementation uses external providers, but can be swapped for database-backed or API-backed implementations without affecting other layers. Responsible for orchestrating fetching from both company and independent source registries in parallel, applying filters, and sorting.
- `src/dao/article-repository.ts` — repository interface
- `src/dao/provider-article-repository.ts` — provider-backed implementation
- `src/dao/cache.ts` — per-source article cache (keyed by source slug string)

**Provider Layer**
Abstracts different data source types behind a common interface. Multiple provider types handle different source formats (RSS feeds, browser-rendered pages, custom APIs). Two registries map sources to providers: one for company blogs, one for independent sources.
- `src/providers/provider.ts` — `DataProvider` interface (`fetch(): Promise<ArticleData[]>`)
- `src/providers/company-registry.ts` — maps `Company` enum values to provider instances
- `src/providers/independent-registry.ts` — maps `IndependentSource` enum values to provider instances
- `src/providers/base-provider.ts` — shared base class
- `src/providers/rss-provider.ts` — RSS feed fetching
- `src/providers/browser-provider.ts`, `src/providers/html-provider.ts` — JS-rendered page scraping
- `src/providers/asana-provider.ts`, `src/providers/ramp-provider.ts` — custom providers

**Filter Layer**
Extensible system for filtering articles by content. Filters are composable and can be applied as include or exclude operations. Currently supports keyword-based filtering with the ability to add custom filter types.
- `src/filters/registry.ts` — maps filter identifiers to implementations
- `src/filters/filter.ts` — filter interface
- `src/filters/keywords.ts` — keyword-based filter implementation

## Data Flow

User input is parsed into structured flags, passed to a command handler, which requests data from the repository. The repository fetches from company providers and independent source providers in parallel, applies filters and sorting, then returns results. Output is formatted as JSON. The `--sources` flag filters which source types are fetched (`companies`, `independent`, or both); omitting it fetches all sources.

## Design Patterns

**Registry Pattern**: Maps identifiers (`Company` enum, `IndependentSource` enum, filter types) to their implementations, enabling easy extension without modifying core logic.

**Repository Pattern**: Decouples data access from business logic, allowing different storage backends while maintaining the same interface.

**Strategy Pattern**: Different data fetching strategies (RSS, browser scraping, custom) all implement the same interface, chosen dynamically based on requirements.

## Extensibility

The system is designed for easy extension:
- New companies are added via registry configuration
- New data sources swap at the repository level
- New filters extend the filter registry
- New commands follow the existing command pattern

## Docs

- [List Articles](./commands/ListArticles.md) — supported flags, output format, and use cases
- [CLI Examples](./reference/CliExamples.md) — example CLI commands
- [Extending](./common/Extensibility.md) — adding companies, filters, commands, and flags
