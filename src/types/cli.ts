import type { Company } from "./index";
import type { ContentFilterIdentifier } from "../cli/filters";

export interface ParsedArgs {
  command: string;
  flags: ParsedFlags;
}

export interface ParsedFlags {
  companies: Company[];
  startDate?: Date;
  endDate?: Date;
  includeFilters: ContentFilterIdentifier[];
  excludeFilters: ContentFilterIdentifier[];
}

export interface FlagProcessor<T> {
  parse(args: string[], index: number): FlagProcessorResult<T>;
}

export interface FlagProcessorResult<T> {
  value: T;
  /** New index position after consuming arguments */
  nextIndex: number;
}
