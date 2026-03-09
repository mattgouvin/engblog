import type { Company } from "../types";
import { ALL_COMPANIES } from "../providers";
import { CliCommand } from "../constants/commands";
import { CliFlag } from "./flags/definitions";
import { ERROR_MESSAGES, HELP_MESSAGES } from "./messages";
import { VALID_FILTERS, ContentFilterIdentifier } from "../constants/filters";
import type { ParsedArgs, ParsedFlags } from "../types/cli";
import { SourceType } from "../constants/sources";
import { CompaniesFlag } from "./flags/companies";
import { DaysBackFlag, DateFlag } from "./flags/date";
import { FilterFlag } from "./flags/filter";

export function parseCliArgs(argv: string[]): ParsedArgs {
  const args = argv.slice(2);

  if (args.length === 0 || CliFlag.Help.isFlag(args[0]!)) {
    console.log(HELP_MESSAGES.global);
    process.exit(0);
  }

  const command = args[0]!;
  if (!Object.values(CliCommand).includes(command as CliCommand)) {
    console.error(ERROR_MESSAGES.unknownCommand(command));
    process.exit(1);
  }

  const flags = parseFlags(args.slice(1), command);

  return { command, flags };
}

function parseFlags(args: string[], command: string): ParsedFlags {
  const companiesProcessor = new CompaniesFlag();
  const daysBackProcessor = new DaysBackFlag();
  const startDateProcessor = new DateFlag(ERROR_MESSAGES.startDateInvalid);
  const endDateProcessor = new DateFlag(ERROR_MESSAGES.endDateInvalid);
  const includeProcessor = new FilterFlag(ERROR_MESSAGES.includeInvalid);
  const excludeProcessor = new FilterFlag(ERROR_MESSAGES.excludeInvalid);

  let companies: Company[] = ALL_COMPANIES;
  let daysBack: { startDate: Date; endDate: Date } | undefined;
  let startDate: Date | undefined;
  let endDate: Date | undefined;
  let includeFilters: ContentFilterIdentifier[] = [];
  let excludeFilters: ContentFilterIdentifier[] = [];
  let sources: SourceType[] | undefined;

  let i = 0;
  while (i < args.length) {
    const arg = args[i]!;

    if (CliFlag.Companies.isFlag(arg)) {
      const result = companiesProcessor.parse(args, i);
      companies = result.value;
      i = result.nextIndex;
    } else if (CliFlag.DaysBack.isFlag(arg)) {
      const result = daysBackProcessor.parse(args, i);
      daysBack = result.value;
      i = result.nextIndex;
    } else if (CliFlag.StartDate.isFlag(arg)) {
      const result = startDateProcessor.parse(args, i);
      startDate = result.value;
      i = result.nextIndex;
    } else if (CliFlag.EndDate.isFlag(arg)) {
      const result = endDateProcessor.parse(args, i);
      endDate = result.value;
      i = result.nextIndex;
    } else if (CliFlag.Include.isFlag(arg)) {
      const result = includeProcessor.parse(args, i);
      includeFilters.push(result.value);
      i = result.nextIndex;
    } else if (CliFlag.Exclude.isFlag(arg)) {
      const result = excludeProcessor.parse(args, i);
      excludeFilters.push(result.value);
      i = result.nextIndex;
    } else if (CliFlag.Sources.isFlag(arg)) {
      const values: SourceType[] = [];
      let j = i + 1;
      while (j < args.length && !args[j]!.startsWith("-")) {
        const val = args[j]!;
        if (val !== SourceType.Companies && val !== SourceType.Independent) {
          console.error(ERROR_MESSAGES.sourcesInvalid);
          process.exit(1);
        }
        values.push(val as SourceType);
        j++;
      }
      if (values.length === 0) {
        console.error(ERROR_MESSAGES.sourcesInvalid);
        process.exit(1);
      }
      sources = values;
      i = j;
    } else if (CliFlag.Help.isFlag(arg)) {
      if (command === CliCommand.ListArticles) {
        console.log(HELP_MESSAGES.listArticles(ALL_COMPANIES, VALID_FILTERS));
      } else {
        console.log(HELP_MESSAGES.global);
      }
      process.exit(0);
    } else if (arg.startsWith("-")) {
      console.error(ERROR_MESSAGES.unknownFlag(arg));
      process.exit(1);
    } else {
      i++;
    }
  }

  validateFlags({
    daysBack,
    startDate,
    endDate,
    includeFilters,
    excludeFilters,
    sources,
    companies,
  });

  // Apply daysBack transformation if provided
  if (daysBack) {
    startDate = daysBack.startDate;
    endDate = daysBack.endDate;
  }

  return {
    companies,
    startDate,
    endDate,
    includeFilters,
    excludeFilters,
    sources,
  };
}

function validateFlags(flags: {
  daysBack?: { startDate: Date; endDate: Date };
  startDate?: Date;
  endDate?: Date;
  includeFilters: ContentFilterIdentifier[];
  excludeFilters: ContentFilterIdentifier[];
  sources?: SourceType[];
  companies: Company[];
}): void {
  // Validate --sources community + --companies conflict
  if (
    flags.sources &&
    flags.sources.length === 1 &&
    flags.sources[0] === SourceType.Independent &&
    flags.companies !== ALL_COMPANIES
  ) {
    console.error(ERROR_MESSAGES.sourcesIndependentCompaniesConflict);
    process.exit(1);
  }

  // Validate mutually exclusive date options
  if (flags.daysBack && (flags.startDate || flags.endDate)) {
    console.error(ERROR_MESSAGES.daysBackMutuallyExclusive);
    process.exit(1);
  }

  if ((flags.startDate || flags.endDate) && !(flags.startDate && flags.endDate)) {
    console.error(ERROR_MESSAGES.dateRangeIncomplete);
    process.exit(1);
  }

  // Validate filter overlap
  const excludeSet = new Set(flags.excludeFilters);
  const overlap = flags.includeFilters.filter((f) => excludeSet.has(f));
  if (overlap.length > 0) {
    console.error(ERROR_MESSAGES.filterOverlap(overlap));
    process.exit(1);
  }
}
