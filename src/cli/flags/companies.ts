import type { Company } from "../../types";
import { ALL_COMPANIES } from "../../providers";
import { ERROR_MESSAGES } from "../messages";
import type { FlagProcessor, FlagProcessorResult } from "../../types/cli";

export class CompaniesFlag implements FlagProcessor<Company[]> {
  parse(args: string[], index: number): FlagProcessorResult<Company[]> {
    const slugs: string[] = [];
    let nextIndex = index + 1;

    while (nextIndex < args.length && !args[nextIndex]!.startsWith("-")) {
      slugs.push(args[nextIndex]!.toLowerCase());
      nextIndex++;
    }

    if (slugs.length === 0) {
      console.error(ERROR_MESSAGES.companiesRequired);
      process.exit(1);
    }

    const valid = slugs.filter((s): s is Company =>
      ALL_COMPANIES.includes(s as Company)
    );
    const invalid = slugs.filter((s) => !ALL_COMPANIES.includes(s as Company));

    if (invalid.length > 0) {
      console.error(ERROR_MESSAGES.unknownCompanies(invalid));
      console.error(`Valid options: ${ALL_COMPANIES.join(", ")}`);
      process.exit(1);
    }

    return { value: valid, nextIndex };
  }
}
