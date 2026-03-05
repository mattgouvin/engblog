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

    const companySet = new Set<string>(ALL_COMPANIES);
    const valid: Company[] = [];
    const invalid: string[] = [];
    for (const s of slugs) {
      if (companySet.has(s)) valid.push(s as Company);
      else invalid.push(s);
    }

    if (invalid.length > 0) {
      console.error(ERROR_MESSAGES.unknownCompanies(invalid));
      console.error(`Valid options: ${ALL_COMPANIES.join(", ")}`);
      process.exit(1);
    }

    return { value: valid, nextIndex };
  }
}
