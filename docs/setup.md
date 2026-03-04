# Setup & Usage

## Installation

Install dependencies using Bun package manager.

## Commands

**List Articles**
Primary command for fetching and filtering engineering blog articles from supported tech companies.

## Command Flags

**Companies** (required)
Specify which companies to fetch articles from. Multiple companies can be requested at once using comma-separated values. Both long and short flag formats are supported.

**Date Filters**
Control the time range of articles to fetch:
- Relative time: Fetch articles from the last N days
- Absolute range: Specify exact start and/or end dates
- Date formats use ISO standard (YYYY-MM-DD)

Note: Relative and absolute date filters are mutually exclusive.

**Content Filters**
Filter articles by content keywords:
- Include mode: Return only articles matching specified filters
- Exclude mode: Omit articles matching specified filters
- Filters use predefined keyword sets for topics like AI/ML

Note: The same filter cannot be used in both include and exclude modes simultaneously.

## Output Format

Results are returned as JSON array containing article objects with title, URL, publication date, and source company.

## Supported Companies

28 tech companies including Google, Meta, Netflix, Stripe, Anthropic, and others.

## Common Use Cases

- Monitor recent engineering posts from specific companies
- Filter for AI/ML related content across multiple sources
- Track articles published within specific date ranges
- Exclude certain topics while browsing company blogs
