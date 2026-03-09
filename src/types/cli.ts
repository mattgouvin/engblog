import type { Company } from "./index";
import type { ContentFilterIdentifier } from "../constants/filters";
import type { SourceType } from "../constants/sources";

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
  sources?: SourceType[];
}

export interface FlagProcessor<T> {
  parse(args: string[], index: number): FlagProcessorResult<T>;
}

export interface FlagProcessorResult<T> {
  value: T;
  /** New index position after consuming arguments */
  nextIndex: number;
}
