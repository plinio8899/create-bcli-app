/**
 * bcli Test Utilities
 *
 * Helpers for testing bcli CLIs without actual terminal interaction.
 *
 * @example
 * ```ts
 * import { bcliTest } from 'bcli/test'
 *
 * const { stdout, ctx } = await bcliTest(myCommand, ['--flag', 'value'])
 * expect(stdout).toContain('Hello')
 * ```
 */
import type {
  CommandContext,
  CommandDefinition,
  CraftConfig,
  ParsedArgs,
} from "../core/types.js";
import { createLogger } from "../output/logger.js";
import { resolveTheme } from "../theme/index.js";

export interface BcliTestResult {
  stdout: string;
  stderr: string;
  ctx: CommandContext;
  output: unknown;
}

const defaultConfig: CraftConfig = {
  name: "test-cli",
  version: "0.0.0",
  theme: "minimal",
};

/**
 * Run a command in test mode — captures stdout and provides
 * mocked prompt, logger, and session APIs.
 */
export async function bcliTest(
  command: CommandDefinition,
  _rawArgs: string[] = [],
  overrides?: { config?: Partial<CraftConfig>; globalFlags?: ParsedArgs },
): Promise<BcliTestResult> {
  const config = { ...defaultConfig, ...overrides?.config };
  const theme = resolveTheme(config.theme);

  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];

  const originalStdout = process.stdout.write.bind(process.stdout);
  const originalStderr = process.stderr.write.bind(process.stderr);

  // Capture stdout
  const stdoutWrite: typeof process.stdout.write = (
    chunk: string | Uint8Array,
  ): boolean => {
    stdoutChunks.push(String(chunk));
    return true;
  };
  process.stdout.write = stdoutWrite;

  // Capture stderr
  const stderrWrite: typeof process.stderr.write = (
    chunk: string | Uint8Array,
  ): boolean => {
    stderrChunks.push(String(chunk));
    return true;
  };
  process.stderr.write = stderrWrite;

  const logger = createLogger(theme);
  const prompt = createMockPrompt();
  const session = createMockSession();

  const ctx: CommandContext = {
    args: {},
    flags: {},
    globalFlags: overrides?.globalFlags ?? {},
    command: {
      path: [],
      name: command.name ?? "test-command",
      description: command.description ?? "",
      args: command.args ?? {},
      flags: command.flags ?? {},
      run: command.run,
    },
    config,
    prompt,
    logger,
    session,
  };

  try {
    const output = await command.run(ctx);
    return {
      stdout: stdoutChunks.join(""),
      stderr: stderrChunks.join(""),
      ctx,
      output,
    };
  } finally {
    process.stdout.write = originalStdout;
    process.stderr.write = originalStderr;
  }
}

/**
 * Create a mock prompt API that returns canned values.
 */
export function createMockPrompt(answers?: Record<string, unknown>) {
  const store = answers ?? {};

  return {
    text: async (opts: { message: string; initial?: string }) => {
      return (store[opts.message] as string) ?? opts.initial ?? "mocked-text";
    },
    confirm: async (opts: { message: string; initial?: boolean }) => {
      return (store[opts.message] as boolean) ?? opts.initial ?? true;
    },
    select: async <T extends string>(opts: {
      message: string;
      options: { label: string; value: T }[];
    }) => {
      return (store[opts.message] as T) ?? opts.options[0].value;
    },
    multiselect: async <T extends string>(opts: {
      message: string;
      options: { label: string; value: T }[];
    }) => {
      return (store[opts.message] as T[]) ?? [opts.options[0].value];
    },
    password: async (_opts: { message: string }) => "mocked-password",
    spinner: () => ({
      message: () => {},
      succeed: () => {},
      fail: () => {},
      warn: () => {},
      stop: () => {},
    }),
  };
}

function createMockSession() {
  return {
    start: () => {},
    stop: (code = 0) => {
      if (code !== 0) throw new Error(`Process exited with code ${code}`);
    },
  };
}
