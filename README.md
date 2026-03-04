# Engineering Blog Discovery

CLI tool for discovering and filtering engineering blog articles from tech companies.

## Quick Start

```bash
bun install
bun src/index.ts list-articles --companies google,meta --daysBack 7
```

## Documentation

- [Setup & Usage](docs/setup.md) - Installation, commands, flags, examples
- [Architecture](docs/architecture.md) - System design, data flow, patterns
- [Extending](docs/extending.md) - Add companies, filters, commands

## Features

- Fetch articles from 28+ tech company engineering blogs
- Filter by date range or relative days
- Include/exclude by content filters (AI, etc.)
- Extensible provider system (RSS, browser scraping, custom)
- Repository pattern for easy data layer swapping
