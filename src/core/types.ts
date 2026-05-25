import type { Theme } from "../theme/index.js";

export interface ArgDefinition {
  type: "string" | "number" | "boolean";
  description?: string;
  required?: boolean;
  default?: string | number | boolean;
  choices?: string[];
}

export interface FlagDefinition extends ArgDefinition {
  alias?: string;
}

export interface CommandArgs {
  [key: string]: ArgDefinition;
}

export interface CommandFlags {
  [key: string]: FlagDefinition;
}

export interface ParsedArgs {
  [key: string]: string | number | boolean | undefined;
}

export type MiddlewarePhase = "init" | "preRun" | "postRun" | "error";

export interface CommandContext {
  args: ParsedArgs;
  flags: ParsedArgs;
  globalFlags: ParsedArgs;
  command: ResolvedCommand;
  config: CraftConfig;
  prompt: PromptAPI;
  logger: LoggerAPI;
  session: SessionAPI;
}

export interface PromptAPI {
  text: (opts: {
    message: string;
    placeholder?: string;
    initial?: string;
    validate?: (v: string) => string | undefined;
  }) => Promise<string>;
  confirm: (opts: { message: string; initial?: boolean }) => Promise<boolean>;
  select: <T extends string>(opts: {
    message: string;
    options: { label: string; value: T; hint?: string }[];
    initial?: T;
  }) => Promise<T>;
  multiselect: <T extends string>(opts: {
    message: string;
    options: { label: string; value: T; hint?: string }[];
    initial?: T[];
  }) => Promise<T[]>;
  password: (opts: {
    message: string;
    validate?: (v: string) => string | undefined;
  }) => Promise<string>;
  spinner: (opts: { message: string }) => SpinnerAPI;
}

export interface SpinnerAPI {
  message: (text: string) => void;
  succeed: (text?: string) => void;
  fail: (text?: string) => void;
  warn: (text?: string) => void;
  stop: () => void;
}

export interface LoggerAPI {
  info: (...args: unknown[]) => void;
  success: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
  raw: (...args: unknown[]) => void;
  table: (
    data: Record<string, unknown>[],
    columns?: { key: string; label: string }[],
  ) => void;
}

export interface SessionAPI {
  start: () => void;
  stop: (exitCode?: number) => void;
}

export interface CommandDefinition {
  name?: string;
  description?: string;
  args?: CommandArgs;
  flags?: CommandFlags;
  run: (ctx: CommandContext) => Promise<unknown> | unknown;
}

export interface ResolvedCommand {
  path: string[];
  name: string;
  description: string;
  args: CommandArgs;
  flags: CommandFlags;
  run: (ctx: CommandContext) => Promise<unknown> | unknown;
}

export interface MiddlewareDefinition {
  phase: MiddlewarePhase;
  run: (ctx: CommandContext) => Promise<void> | void;
}

export interface PluginDefinition {
  name: string;
  setup: (config: CraftConfig) => CraftConfig | void;
}

export interface CraftConfig {
  name: string;
  version: string;
  description?: string;
  theme?: string | Theme;
  commandsDir?: string;
  flags?: CommandFlags;
  middlewares?: MiddlewareDefinition[];
  plugins?: PluginDefinition[];
  bin?: string;
}
