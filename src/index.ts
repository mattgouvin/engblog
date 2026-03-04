#!/usr/bin/env bun
import { parseCliArgs } from "./cli/parser";
import { CliCommand } from "./constants/commands";
import { listArticles } from "./cli/handler";

async function main(): Promise<void> {
  const { command, flags } = parseCliArgs(process.argv);

  switch (command) {
    case CliCommand.ListArticles:
      await listArticles(flags);
      break;
    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }
}

main();
