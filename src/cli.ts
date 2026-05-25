#!/usr/bin/env node

import { existsSync } from "node:fs";
import chalk from "chalk";
import { buildHelp, runCommand } from "./core/command.js";
import { resolveConfig } from "./core/config.js";
import { FSRouter } from "./router/fs-router.js";
import { resolveTheme } from "./theme/index.js";

// Craft CLI entry point for end-user CLIs
// This file would be compiled into the user's CLI binary

async function main() {
  const rawArgs = process.argv.slice(2);
  const config = resolveConfig({});

  // Handle --help / --version at root
  if (rawArgs.includes("--help") || rawArgs.includes("-h")) {
    const _theme = resolveTheme(config.theme);
    console.log(
      chalk.bold(`${config.name}`) + chalk.dim(` v${config.version}`),
    );
    console.log("");
    console.log(chalk.bold("Commands:"));
    console.log("");

    // Try to list commands from the commands directory
    if (config.commandsDir && existsSync(config.commandsDir)) {
      const router = new FSRouter(config.commandsDir);
      const commands = router.list();
      for (const cmd of commands) {
        const path = cmd.path.join(" ");
        console.log(`  ${chalk.cyan(path)}`);
        if (cmd.description) {
          console.log(`    ${chalk.dim(cmd.description)}`);
        }
      }
    }
    console.log("");
    console.log(chalk.dim("Run `bcli <command> --help` for detailed usage."));
    return;
  }

  if (rawArgs.includes("--version") || rawArgs.includes("-v")) {
    console.log(config.version);
    return;
  }

  // Find command via file-system router
  if (config.commandsDir && existsSync(config.commandsDir)) {
    const router = new FSRouter(config.commandsDir);

    // Separate command segments from positional args/flags
    const cmdSegments: string[] = [];
    const cmdRest: string[] = [];
    let parsingCommand = true;
    for (const arg of rawArgs) {
      if (parsingCommand && !arg.startsWith("-")) {
        cmdSegments.push(arg);
      } else {
        parsingCommand = false;
        cmdRest.push(arg);
      }
    }

    const resolved = router.find(cmdSegments);

    if (resolved) {
      if (cmdRest.includes("--help") || cmdRest.includes("-h")) {
        console.log(buildHelp(resolved.command, config, config.flags ?? {}));
        return;
      }
      await runCommand(
        resolved.command,
        cmdRest,
        config.flags ?? {},
        {},
        config,
      );
    } else {
      const theme = resolveTheme(config.theme);
      console.error(
        chalk.red(
          `${theme.icons.error} Unknown command: ${cmdSegments.join(" ")}`,
        ),
      );
      console.error(chalk.dim("Run `bcli --help` to see available commands."));
      process.exit(1);
    }
  } else {
    console.error(chalk.red("No commands directory found."));
    console.error(
      chalk.dim(
        "Create a src/commands/ directory or configure commandsDir in bcli.config.ts",
      ),
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(chalk.red(String(err)));
  process.exit(1);
});
