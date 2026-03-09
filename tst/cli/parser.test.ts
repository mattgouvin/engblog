import { describe, test, expect, beforeEach, afterEach, spyOn } from "bun:test";
import type { Mock } from "bun:test";
import { parseCliArgs } from "../../src/cli/parser";
import { ContentFilterIdentifier } from "../../src/constants/filters";

// argv structure: [node, script, command, ...flags]
const argv = (...flags: string[]) => ["bun", "engblog", "list-articles", ...flags];

describe("--sources flag", () => {
  let exitSpy: Mock<typeof process.exit>;
  let errorSpy: Mock<typeof console.error>;

  beforeEach(() => {
    exitSpy = spyOn(process, "exit").mockImplementation((() => {
      throw new Error("process.exit called");
    }) as never);
    errorSpy = spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    exitSpy.mockRestore();
    errorSpy.mockRestore();
  });

  // Scenario: Default behavior unchanged
  test("omitting --sources returns sources: undefined", () => {
    const result = parseCliArgs(argv());
    expect(result.flags.sources).toBeUndefined();
  });

  // Scenario: Companies-only flag parses correctly
  test("--sources companies sets sources: ['companies']", () => {
    const result = parseCliArgs(argv("--sources", "companies"));
    expect(result.flags.sources).toEqual(["companies"]);
  });

  // Scenario: Community-only flag parses correctly
  test("--sources community sets sources: ['community']", () => {
    const result = parseCliArgs(argv("--sources", "community"));
    expect(result.flags.sources).toEqual(["community"]);
  });

  // Scenario: Both values (equivalent to default)
  test("--sources companies community sets sources: ['companies', 'community']", () => {
    const result = parseCliArgs(argv("--sources", "companies", "community"));
    expect(result.flags.sources).toEqual(["companies", "community"]);
  });

  // Scenario: Invalid source type
  test("--sources unknown exits 1 and lists valid values", () => {
    expect(() => parseCliArgs(argv("--sources", "unknown"))).toThrow();
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining("companies"));
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining("community"));
  });

  // Scenario: --sources with no values
  test("--sources with no values exits 1", () => {
    expect(() => parseCliArgs(argv("--sources"))).toThrow();
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  // Scenario: Conflict with --companies when sources is community-only
  test("--sources community --companies google exits 1 with mutual exclusion error", () => {
    expect(() =>
      parseCliArgs(argv("--sources", "community", "--companies", "google"))
    ).toThrow();
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining("mutually exclusive"));
  });

  // Scenario: --sources companies + --companies is allowed
  test("--sources companies --companies google is valid", () => {
    const result = parseCliArgs(argv("--sources", "companies", "--companies", "google"));
    expect(result.flags.sources).toEqual(["companies"]);
    expect(result.flags.companies).toEqual(["google"]);
  });

  // Scenario: Compatible with other flags
  test("--sources community --daysBack 7 parses correctly", () => {
    const result = parseCliArgs(argv("--sources", "community", "--daysBack", "7"));
    expect(result.flags.sources).toEqual(["community"]);
    expect(result.flags.startDate).toBeInstanceOf(Date);
    expect(result.flags.endDate).toBeInstanceOf(Date);
  });

  // Scenario: Compatible with date and content filters (full spec scenario)
  test("--sources community --daysBack 7 --include ai parses correctly", () => {
    const result = parseCliArgs(argv("--sources", "community", "--daysBack", "7", "--include", "ai"));
    expect(result.flags.sources).toEqual(["community"]);
    expect(result.flags.startDate).toBeInstanceOf(Date);
    expect(result.flags.endDate).toBeInstanceOf(Date);
    expect(result.flags.includeFilters).toEqual([ContentFilterIdentifier.AI]);
  });
});
