import { ERROR_MESSAGES } from "../messages";
import type { FlagProcessor, FlagProcessorResult } from "../../types/cli";

export class DaysBackFlag implements FlagProcessor<{ startDate: Date; endDate: Date }> {
  parse(args: string[], index: number): FlagProcessorResult<{ startDate: Date; endDate: Date }> {
    const value = parseInt(args[index + 1] ?? "", 10);

    if (isNaN(value) || value < 1) {
      console.error(ERROR_MESSAGES.daysBackInvalid);
      process.exit(1);
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - value);

    return {
      value: { startDate, endDate },
      nextIndex: index + 2,
    };
  }
}

export class DateFlag implements FlagProcessor<Date> {
  constructor(private errorMessage: string) {}

  parse(args: string[], index: number): FlagProcessorResult<Date> {
    const dateStr = args[index + 1] ?? "";
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      console.error(this.errorMessage);
      process.exit(1);
    }

    return {
      value: date,
      nextIndex: index + 2,
    };
  }
}
