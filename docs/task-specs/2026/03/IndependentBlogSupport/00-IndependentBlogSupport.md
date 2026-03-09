# Feature: IndependentBlogSupport

## Summary
Extend `list-articles` to include articles from independent sources (independent blogs, newsletters, individual contributors) alongside company engineering blogs. Independent sources are included by default and can be opted out via a CLI flag.

## Terminology
- **Company blogs** — engineering content published by tech companies (existing behavior, e.g. Google, Stripe)
- **Independent sources** — engineering content from independent individuals, newsletters, or communities not affiliated with a specific company (new, e.g. Latent Space)

## Affected System Areas
- Provider Layer — new independent source registry mapping source slugs to RSS providers
- Repository Layer — fetches from independent registry in addition to company registry by default; participates in existing caching
- CLI Layer — new `--no-community` flag added to `list-articles`
- Types — new `IndependentSource` enum alongside existing `Company` enum
- Output Contract — `company` field renamed to `source`; new `sourceType: "company" | "independent"` discriminator added to all articles

## Tasks (in implementation order)
- [01-CommunityRegistry.md](./01-CommunityRegistry.md) — introduce independent source type, register Latent Space, fetch by default
- [02-CommunityFlag.md](./02-CommunityFlag.md) — add `--no-community` CLI flag to opt out of independent source results

## Feature-Level Acceptance Criteria
These criteria are only verifiable after both tasks are complete.

### Scenario: Default fetch includes both company blogs and independent sources
**Given** no source flags are provided
**When** the user runs `engblog list-articles --daysBack 7`
**Then** results include articles from both company blogs and independent sources
**And** Latent Space articles appear in the output with `sourceType: "independent"`

### Scenario: Opt-out excludes independent sources but retains company blogs
**Given** the user wants only company blog articles
**When** the user runs `engblog list-articles --no-community --daysBack 7`
**Then** results contain no articles with `sourceType: "independent"`
**And** company blog articles are still returned

## Sequencing

| Order | File | Depends On | Reason |
|-------|------|------------|--------|
| 1 | 01-CommunityRegistry.md | — | Establishes the registry, fetch logic, caching, and output contract changes that 02 depends on |
| 2 | 02-CommunityFlag.md | 01-CommunityRegistry.md | Flag controls behavior introduced in task 01; cannot be tested without the registry |
