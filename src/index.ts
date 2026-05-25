/** bcli — Opinionated framework for building interactive CLI apps. By Billy. */

export { buildHelp, runCommand } from "./core/command.js";
export {
  defineCommand,
  defineConfig,
  defineMiddleware,
  definePlugin,
} from "./core/index.js";
export type {
  ArgDefinition,
  CommandArgs,
  CommandContext,
  CommandDefinition,
  CommandFlags,
  CraftConfig,
  FlagDefinition,
  LoggerAPI,
  MiddlewareDefinition,
  MiddlewarePhase,
  ParsedArgs,
  PluginDefinition,
  PromptAPI,
  ResolvedCommand,
  SessionAPI,
  SpinnerAPI,
} from "./core/types.js";
export { createLogger } from "./output/logger.js";
export { createSession } from "./output/session.js";
export { parse, parseArgs, parseFlags, validate } from "./parser/index.js";
export { createPromptAPI, createSpinner } from "./prompts/index.js";
export { FSRouter } from "./router/fs-router.js";
export type { Theme, ThemeColors } from "./theme/index.js";
export { builtinThemes, resolveTheme } from "./theme/index.js";
export { generateAutocomplete } from "./utils/autocomplete.js";
