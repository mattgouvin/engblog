# Extending the System

## Adding Companies

**RSS Feed Sources**
Most companies are added by configuring an RSS provider with the feed URL. Add the company identifier to the enum, then map it to an RSS provider in the registry.

**Browser-Rendered Sources**
For sites requiring JavaScript execution, use a browser provider with CSS selectors to extract article data. Configure selectors for article containers, titles, links, and optional publish dates.

**Custom Sources**
When standard providers don't fit, create a custom provider implementing the base interface. Custom providers handle unique parsing requirements or complex API interactions.

Note: Providers fetch article data without company context. The repository layer assigns company information when data is retrieved.

## Adding Content Filters

**Keyword-Based Filters**
Define a filter identifier and associate it with a keyword list. The system matches articles containing any of the specified keywords in their title.

**Custom Filter Logic**
Implement the filter interface for complex matching rules beyond keyword matching. Custom filters can analyze any article properties and apply arbitrary logic.

Filters are registered centrally and can be used in include or exclude mode during article queries.

## Adding Commands

New CLI commands follow a standard pattern:
1. Define the command identifier
2. Create a handler function that accepts parsed flags
3. Register the command in the main routing logic

Commands should delegate data access to the repository layer rather than directly interacting with data sources.

## Adding CLI Flags

New flags require:
1. Flag identifier and optional short form
2. Parser/processor to validate and extract flag values
3. Integration into the main argument parser
4. Type definition for the parsed flag value

Flag processors handle validation and conversion of raw string arguments into typed values.

## Swapping Data Sources

Replace the repository implementation to change the underlying data source:

**Database-Backed Repository**
Query a database (DynamoDB, PostgreSQL, etc.) instead of fetching from external APIs. The repository interface remains the same while the implementation changes completely.

**Service API Repository**
Connect to an internal service API that manages blog data. Translate filter parameters to API calls and convert responses to the standard article format.

The repository pattern ensures the command layer remains unchanged regardless of the data source.
