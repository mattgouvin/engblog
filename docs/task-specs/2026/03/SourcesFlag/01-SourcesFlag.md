# Add `--sources` Flag

## User Story
As a CLI user, I want to control which source types are fetched so that I can retrieve only company blogs, only independent/community sources, or both.

## Context
The `list-articles` command currently supports `--no-community` to exclude independent sources, but this is a negative flag. Adding a companion `--no-companies` flag creates a confusing pair of negative flags with a conflict matrix (`--no-companies + --no-community = nothing`), a broken validation pattern (can't distinguish default `--companies` from explicit), and parameter sprawl across 5 files.

The cleaner design is a single positive `--sources` flag that explicitly names what to include. This replaces `--no-community` and eliminates the need for `--no-companies`.

## Requirements (EARS)

### Functional
- When `--sources companies` is provided, the system shall fetch only from company registry sources.
- When `--sources community` is provided, the system shall fetch only from independent/community registry sources.
- When `--sources companies community` (both values) is provided, the system shall fetch from all sources (equivalent to default).
- When `--sources` is omitted, the system shall fetch from all sources (default behavior unchanged).
- The system shall support `--sources` alongside `--companies`, date, and content filter flags.

### Constraints
- When `--sources` receives an unrecognized value, the system shall exit with a non-zero status and print a descriptive error message listing valid values.
- When `--sources community` and `--companies` are both provided, the system shall exit with a non-zero status (no company sources to filter).
- The system shall remove `--no-community`; `--sources companies` is the replacement.

## Acceptance Criteria

### Scenario: Community-only results
**Given** the CLI is invoked with `--sources community`
**When** the command executes
**Then** all returned articles have `sourceType: "independent"`
**And** no article has `sourceType: "company"`

### Scenario: Companies-only results
**Given** the CLI is invoked with `--sources companies`
**When** the command executes
**Then** all returned articles have `sourceType: "company"`
**And** no article has `sourceType: "independent"`

### Scenario: Compatible with date and content filters
**Given** the CLI is invoked with `--sources community --daysBack 7 --include ai`
**When** the command executes
**Then** only independent source articles matching the `ai` filter within the last 7 days are returned

### Scenario: Conflict with `--companies` when sources is community-only
**Given** the CLI is invoked with `--sources community --companies google`
**When** the parser processes the flags
**Then** the command exits with a non-zero status
**And** an error message indicates that `--sources community` and `--companies` are mutually exclusive

### Scenario: Default behavior unchanged
**Given** the CLI is invoked without `--sources`
**When** the command executes
**Then** both company and independent source articles are returned as before

### Scenario: Invalid source type
**Given** the CLI is invoked with `--sources unknown`
**When** the parser processes the flags
**Then** the command exits with a non-zero status
**And** an error message lists valid values: `companies`, `community`

## Out of Scope
- Filtering by specific independent sources
- Adding short flag alias for `--sources`
