# Overview

CLI tool for discovering engineering blog articles from tech companies.

## System Overview

The system follows a layered structure where each layer has clear responsibilities and well-defined interfaces. Data flows from user input through parsing, command handling, data access, and finally to output.

## Core Layers

**CLI Layer**
Handles command-line argument parsing and validation. Converts raw string arguments into structured flags and options. Validates mutually exclusive options and ensures data integrity before passing to command handlers.
- `src/cli/parser.ts` — main argument parser
- `src/cli/flags/definitions.ts` — flag identifiers and short forms
- `src/cli/flags/companies.ts`, `src/cli/flags/date.ts`, `src/cli/flags/filter.ts` — per-flag processors

**Command Layer**
Contains business logic for each CLI command. Currently supports listing articles with various filter options. Commands orchestrate work by delegating to the repository layer rather than directly accessing data sources.
- `src/cli/handler.ts` — command handlers

**Repository Layer**
Provides a unified interface for data access regardless of the underlying data source. The current implementation uses external providers, but can be swapped for database-backed or API-backed implementations without affecting other layers. Responsible for orchestrating fetching, filtering, and sorting operations.
- `src/dao/article-repository.ts` — repository interface
- `src/dao/provider-article-repository.ts` — provider-backed implementation
- `src/dao/cache.ts` — per-company article cache

**Provider Layer**
Abstracts different data source types behind a common interface. Multiple provider types handle different source formats (RSS feeds, browser-rendered pages, custom APIs). Each provider knows how to fetch and parse data from its specific source type. A registry maps companies to their appropriate providers.
- `src/providers/registry.ts` — maps companies to provider instances
- `src/providers/base-provider.ts` — shared base class
- `src/providers/rss-provider.ts` — RSS feed fetching
- `src/providers/browser-provider.ts`, `src/providers/html-provider.ts` — JS-rendered page scraping
- `src/providers/asana-provider.ts`, `src/providers/ramp-provider.ts` — custom providers

**Filter Layer**
Extensible system for filtering articles by content. Filters are composable and can be applied as include or exclude operations. Currently supports keyword-based filtering with the ability to add custom filter types.
- `src/filters/registry.ts` — maps filter identifiers to implementations
- `src/filters/filter.ts` — filter interface
- `src/filters/keywords.ts` — keyword-based filter implementation
- `src/constants/ai-keywords.ts` — AI/ML keyword list

## Data Flow

User input is parsed into structured flags, passed to a command handler, which requests data from the repository. The repository fetches from multiple providers in parallel, applies filters and sorting, then returns results. Output is formatted as JSON.

## Design Patterns

**Registry Pattern**: Maps identifiers (companies, filter types) to their implementations, enabling easy extension without modifying core logic.

**Repository Pattern**: Decouples data access from business logic, allowing different storage backends while maintaining the same interface.

**Strategy Pattern**: Different data fetching strategies (RSS, browser scraping, custom) all implement the same interface, chosen dynamically based on requirements.

## Extensibility

The system is designed for easy extension:
- New companies are added via registry configuration
- New data sources swap at the repository level
- New filters extend the filter registry
- New commands follow the existing command pattern

## Docs

- [Functionality](./functionality.md) — supported commands, flags, and output format
- [CLI Examples](./cli.md) — example CLI commands
- [Extending](./extending.md) — adding companies, filters, commands, and flags
