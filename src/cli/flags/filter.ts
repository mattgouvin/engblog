import { ContentFilterIdentifier, VALID_FILTERS } from "../../constants/filters";
import type { FlagProcessor, FlagProcessorResult } from "../../types/cli";

export class FilterFlag implements FlagProcessor<ContentFilterIdentifier> {
  constructor(private errorMessageFn: (filters: ContentFilterIdentifier[]) => string) {}

  parse(args: string[], index: number): FlagProcessorResult<ContentFilterIdentifier> {
    const filter = args[index + 1] ?? "";

    if (!VALID_FILTERS.includes(filter as ContentFilterIdentifier)) {
      console.error(this.errorMessageFn(VALID_FILTERS));
      process.exit(1);
    }

    return {
      value: filter as ContentFilterIdentifier,
      nextIndex: index + 2,
    };
  }
}
