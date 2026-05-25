import type {
  CommandArgs,
  CommandFlags,
  FlagDefinition,
  ParsedArgs,
} from "../core/types.js";

export interface ParseResult {
  args: ParsedArgs;
  flags: ParsedArgs;
  rest: string[];
}

export function parseFlags(
  raw: string[],
  flagDefs: Record<string, FlagDefinition>,
): { flags: ParsedArgs; rest: string[] } {
  const flags: ParsedArgs = {};
  const rest: string[] = [];

  const aliasMap: Record<string, string> = {};
  for (const [name, def] of Object.entries(flagDefs)) {
    if (def.alias) aliasMap[def.alias] = name;
    if (def.default !== undefined) flags[name] = def.default;
  }

  let i = 0;
  while (i < raw.length) {
    const arg = raw[i];

    if (arg === "--") {
      rest.push(...raw.slice(i + 1));
      break;
    }

    if (arg.startsWith("--")) {
      const eqIdx = arg.indexOf("=");
      let name: string;
      let value: string | undefined;
      if (eqIdx !== -1) {
        name = arg.slice(2, eqIdx);
        value = arg.slice(eqIdx + 1);
      } else {
        name = arg.slice(2);
        value =
          i + 1 < raw.length && !raw[i + 1].startsWith("-")
            ? raw[++i]
            : undefined;
      }
      const def = flagDefs[name];
      if (def) {
        flags[name] = coerceFlag(value, def);
      } else {
        flags[name] = value ?? true;
      }
    } else if (arg.startsWith("-") && arg.length > 1 && !arg.startsWith("--")) {
      const shortName = arg.slice(1);
      const longName = aliasMap[shortName];
      if (longName) {
        const def = flagDefs[longName];
        if (def?.type === "boolean") {
          flags[longName] = true;
        } else {
          const value =
            i + 1 < raw.length && !raw[i + 1].startsWith("-")
              ? raw[++i]
              : undefined;
          flags[longName] = coerceFlag(value, def);
        }
      } else {
        rest.push(arg);
      }
    } else {
      rest.push(arg);
    }
    i++;
  }

  return { flags, rest };
}

function coerceFlag(
  value: string | undefined,
  def: FlagDefinition,
): string | number | boolean {
  if (value === undefined) return true;
  if (def.type === "boolean") return value !== "false" && value !== "0";
  if (def.type === "number") {
    const n = Number(value);
    return Number.isNaN(n) ? value : n;
  }
  return value;
}

export function parseArgs(rest: string[], argDefs: CommandArgs): ParsedArgs {
  const args: ParsedArgs = {};
  const entries = Object.entries(argDefs);

  for (const [name, def] of entries) {
    if (def.default !== undefined) args[name] = def.default;
  }

  const positional = entries.filter(([_, def]) => def.required !== false);
  for (let i = 0; i < Math.min(rest.length, positional.length); i++) {
    const [name, def] = positional[i];
    const value = rest[i];
    if (def.type === "number") {
      args[name] = Number(value);
    } else {
      args[name] = value;
    }
  }

  return args;
}

export function parse(
  raw: string[],
  argDefs: CommandArgs,
  flagDefs: CommandFlags,
): ParseResult {
  const { flags, rest } = parseFlags(raw, flagDefs);
  const args = parseArgs(rest, argDefs);
  return { args, flags, rest };
}

export function validate(
  args: ParsedArgs,
  argDefs: CommandArgs,
): string | null {
  for (const [name, def] of Object.entries(argDefs)) {
    if (def.required && (args[name] === undefined || args[name] === "")) {
      return `Missing required argument: ${name}`;
    }
    if (args[name] !== undefined && def.choices && def.choices.length > 0) {
      if (!def.choices.includes(args[name] as string)) {
        return `Invalid value for ${name}: must be one of [${def.choices.join(", ")}]`;
      }
    }
  }
  return null;
}
