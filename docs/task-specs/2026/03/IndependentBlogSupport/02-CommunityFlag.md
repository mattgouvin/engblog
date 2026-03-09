# Community Sources CLI Flag

## User Story
As an engineer using engblog, I want to opt out of independent source results so that I can limit output to company engineering blogs only when needed.

## Context
Independent source fetching is enabled by default after 01-CommunityRegistry.md is complete. This task adds a `--no-community` boolean flag to `list-articles` that suppresses independent source results. Flag processing follows the pattern in `src/cli/flags/` and integrates into `src/cli/parser.ts`. The parsed flag is passed to the repository, which skips independent source fetching when it is set.

## Requirements (EARS)

### Functional
- When `--no-community` is passed, the system shall exclude all independent source articles from the result set.
- Where `--no-community` is not passed, the system shall include independent source articles by default.
- The system shall surface `--no-community` in the `--help` output for `list-articles`.

### Constraints
- The system shall not affect company blog fetching when `--no-community` is passed.
- The system shall not introduce a `--community` flag (inclusion is the default; only opt-out is needed).
- The system shall not change the behavior of `--include` / `--exclude` content filters.

## Acceptance Criteria

### Scenario: Independent sources excluded when flag is passed
**Given** independent sources are registered and have articles in the date range
**When** `engblog list-articles --daysBack 7 --no-community` is run
**Then** the output contains no articles with `sourceType: "independent"`
**And** company blog articles are present in the output

### Scenario: Independent sources included when flag is absent
**Given** independent sources are registered and have articles in the date range
**When** `engblog list-articles --daysBack 7` is run without `--no-community`
**Then** the output contains articles with both `sourceType: "company"` and `sourceType: "independent"`

### Scenario: Flag appears in help output
**Given** the user wants to understand available options
**When** `engblog list-articles --help` is run
**Then** `--no-community` appears in the help text with a description

### Scenario: Flag combined with company filter
**Given** the user wants only a specific company's articles
**When** `engblog list-articles --companies stripe --no-community --daysBack 14` is run
**Then** the output contains only Stripe articles
**And** no articles with `sourceType: "independent"` appear

## Out of Scope
- Per-source opt-out (e.g. `--no-community latentspace`)
- A `--community` inclusion flag (default is already on)
- Modifying how content filters interact with independent sources
