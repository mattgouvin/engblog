import type { Company } from "../types";
import type { ContentFilterIdentifier } from "./filters";

export const ERROR_MESSAGES = {
  unknownCommand: (cmd: string) => `Unknown command: ${cmd}`,
  companiesRequired: "--companies requires at least one company name",
  unknownCompanies: (invalid: string[]) => `Unknown companies: ${invalid.join(", ")}`,
  daysBackInvalid: "--daysBack must be a positive integer",
  startDateInvalid: "--startDate must be a valid date (e.g., 2025-01-15 or 2025-01-15T00:00:00Z)",
  endDateInvalid: "--endDate must be a valid date (e.g., 2025-01-15 or 2025-01-15T00:00:00Z)",
  includeInvalid: (validFilters: ContentFilterIdentifier[]) => `--include must be one of: ${validFilters.join(", ")}`,
  excludeInvalid: (validFilters: ContentFilterIdentifier[]) => `--exclude must be one of: ${validFilters.join(", ")}`,
  filterOverlap: (overlapping: ContentFilterIdentifier[]) => `Cannot use the same filter in both --include and --exclude: ${overlapping.join(", ")}`,
  daysBackMutuallyExclusive: "--daysBack cannot be used together with --startDate or --endDate",
  dateRangeIncomplete: "Both --startDate and --endDate must be provided together",
  unknownFlag: (flag: string) => `Unknown flag: ${flag}`,
  sourcesInvalid: `--sources values must be one or more of: companies, independent`,
  sourcesIndependentCompaniesConflict: `--sources independent and --companies are mutually exclusive`,
} as const;

export const HELP_MESSAGES = {
  global: `Usage: engblog <command> [options]

Commands:
  list-articles    List articles from engineering blogs

Global options:
  --help, -h       Show help`,

  listArticles: (validCompanies: Company[], validFilters: ContentFilterIdentifier[]) => `Usage: engblog list-articles [--companies|-c <slug> ...] [--daysBack|-d <n> | --startDate|-s <date> --endDate|-e <date>] [--include|-i <filter> ...] [--exclude|-x <filter> ...]

  --companies, -c    Space-separated list of company slugs (default: all)
                     Valid: ${validCompanies.join(", ")}
  --daysBack, -d     Only return articles from last N days (mutually exclusive with --startDate/--endDate)
  --startDate, -s    Start date (inclusive) in YYYY-MM-DD format (mutually exclusive with --daysBack)
  --endDate, -e      End date (inclusive) in YYYY-MM-DD format (mutually exclusive with --daysBack)
  --include, -i      Include only articles matching filter (can be used multiple times)
                     Valid: ${validFilters.join(", ")}
  --exclude, -x      Exclude articles matching filter (can be used multiple times)
                     Valid: ${validFilters.join(", ")}
  --sources          Source types to include: companies, independent (default: both)`,
} as const;
