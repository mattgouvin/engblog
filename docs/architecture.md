# Architecture

CLI tool for discovering engineering blog articles from tech companies.

## System Overview

The system follows a layered architecture where each layer has clear responsibilities and well-defined interfaces. Data flows from user input through parsing, command handling, data access, and finally to output.

## Core Layers

**CLI Layer**
Handles command-line argument parsing and validation. Converts raw string arguments into structured flags and options. Validates mutually exclusive options and ensures data integrity before passing to command handlers.

**Command Layer**
Contains business logic for each CLI command. Currently supports listing articles with various filter options. Commands orchestrate work by delegating to the repository layer rather than directly accessing data sources.

**Repository Layer**
Provides a unified interface for data access regardless of the underlying data source. The current implementation uses external providers, but can be swapped for database-backed or API-backed implementations without affecting other layers. Responsible for orchestrating fetching, filtering, and sorting operations.

**Provider Layer**
Abstracts different data source types behind a common interface. Multiple provider types handle different source formats (RSS feeds, browser-rendered pages, custom APIs). Each provider knows how to fetch and parse data from its specific source type. A registry maps companies to their appropriate providers.

**Filter Layer**
Extensible system for filtering articles by content. Filters are composable and can be applied as include or exclude operations. Currently supports keyword-based filtering with the ability to add custom filter types.

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
