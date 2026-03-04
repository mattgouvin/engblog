export class CliFlag {
  constructor(
    public readonly long: string,
    public readonly short: string,
  ) {}

  isFlag(arg: string): boolean {
    return arg === this.long || arg === this.short;
  }

  static readonly Companies = new CliFlag("--companies", "-c");
  static readonly DaysBack = new CliFlag("--daysBack", "-d");
  static readonly StartDate = new CliFlag("--startDate", "-s");
  static readonly EndDate = new CliFlag("--endDate", "-e");
  static readonly Include = new CliFlag("--include", "-i");
  static readonly Exclude = new CliFlag("--exclude", "-x");
  static readonly Help = new CliFlag("--help", "-h");
}
