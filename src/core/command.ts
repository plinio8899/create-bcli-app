import chalk from "chalk";
import { createLogger } from "../output/logger.js";
import { createSession } from "../output/session.js";
import { parse, validate } from "../parser/index.js";
import { createPromptAPI } from "../prompts/index.js";
import { resolveTheme } from "../theme/index.js";
import type {
  CommandContext,
  CommandDefinition,
  CommandFlags,
  CraftConfig,
  ParsedArgs,
  ResolvedCommand,
} from "./types.js";

export function defineCommand(def: CommandDefinition): CommandDefinition {
  return def;
}

export async function runCommand(
  command: ResolvedCommand,
  rawArgs: string[],
  globalFlags: CommandFlags,
  globalFlagValues: ParsedArgs,
  config: CraftConfig,
): Promise<unknown> {
  const theme = resolveTheme(config.theme);
  const prompt = createPromptAPI(theme);
  const logger = createLogger(theme);
  const session = createSession();

  const { args, flags } = parse(rawArgs, command.args, {
    ...globalFlags,
    ...command.flags,
  });

  const validationError = validate(args, command.args);
  if (validationError) {
    logger.error(validationError);
    session.stop(1);
  }

  const ctx: CommandContext = {
    args,
    flags,
    globalFlags: globalFlagValues,
    command,
    config,
    prompt,
    logger,
    session,
  };

  try {
    const result = await command.run(ctx);
    return result;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error(msg);
    session.stop(1);
  }
}

export function buildHelp(
  command: ResolvedCommand,
  config: CraftConfig,
  globalFlags: CommandFlags,
): string {
  const _theme = resolveTheme(config.theme);
  const c = chalk;

  let output = "";

  output += `${c.bold(`${config.name}`) + c.dim(` v${config.version}`)}\n`;
  if (config.description) output += `${config.description}\n`;
  output += "\n";

  if (command.description) {
    output += `${c.bold("Description:")}\n`;
    output += `  ${command.description}\n\n`;
  }

  if (command.path.length > 0) {
    output += `${c.bold("Usage:")}\n`;
    output += `  ${config.bin ?? config.name} ${command.path.join(" ")} [args] [flags]\n\n`;
  } else {
    output += `${c.bold("Usage:")}\n`;
    output += `  ${config.bin ?? config.name} [command] [args] [flags]\n\n`;
  }

  const allFlags = { ...globalFlags, ...command.flags };
  if (Object.keys(allFlags).length > 0) {
    output += `${c.bold("Flags:")}\n`;
    for (const [name, flag] of Object.entries(allFlags)) {
      const alias = flag.alias ? `-${flag.alias}, ` : "    ";
      const req = flag.required ? c.red(" (required)") : "";
      const defaultVal =
        flag.default !== undefined ? c.dim(` [default: ${flag.default}]`) : "";
      output += `  ${alias}--${name}${req}${defaultVal}\n`;
      if (flag.description) output += `    ${c.dim(flag.description)}\n`;
    }
    output += "\n";
  }

  if (Object.keys(command.args).length > 0) {
    output += `${c.bold("Arguments:")}\n`;
    for (const [name, arg] of Object.entries(command.args)) {
      const req = arg.required ? c.red(" (required)") : "";
      const choices = arg.choices
        ? c.dim(` [choices: ${arg.choices.join(", ")}]`)
        : "";
      const defaultVal =
        arg.default !== undefined ? c.dim(` [default: ${arg.default}]`) : "";
      output += `  ${name}${req}${choices}${defaultVal}\n`;
      if (arg.description) output += `    ${c.dim(arg.description)}\n`;
    }
    output += "\n";
  }

  return output;
}
