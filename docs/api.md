# API Reference

Complete API reference for the `bcli` package.

## `defineConfig`

```typescript
import { defineConfig } from 'bcli'

function defineConfig(config: CraftConfig): CraftConfig
```

Creates a typed configuration object. See [Configuration](/configuration) for all options.

## `defineCommand`

```typescript
import { defineCommand } from 'bcli'

function defineCommand(def: CommandDefinition): CommandDefinition
```

Defines a CLI command with args, flags, and a run handler.

```typescript
interface CommandDefinition {
  name?: string
  description?: string
  args?: Record<string, ArgDefinition>
  flags?: Record<string, FlagDefinition>
  run: (ctx: CommandContext) => Promise<unknown> | unknown
}
```

## `defineMiddleware`

```typescript
import { defineMiddleware } from 'bcli'

function defineMiddleware(def: MiddlewareDefinition): MiddlewareDefinition
```

Defines a lifecycle hook.

```typescript
interface MiddlewareDefinition {
  phase: 'init' | 'preRun' | 'postRun' | 'error'
  run: (ctx: CommandContext) => Promise<void> | void
}
```

## `definePlugin`

```typescript
import { definePlugin } from 'bcli'

function definePlugin(def: PluginDefinition): PluginDefinition
```

Defines a plugin.

```typescript
interface PluginDefinition {
  name: string
  setup: (config: CraftConfig) => CraftConfig | void
}
```

## `CommandContext`

Everything passed to a command's `run` function:

```typescript
interface CommandContext {
  args: Record<string, string | number | boolean | undefined>
  flags: Record<string, string | number | boolean | undefined>
  globalFlags: Record<string, string | number | boolean | undefined>
  command: ResolvedCommand
  config: CraftConfig
  prompt: PromptAPI
  logger: LoggerAPI
  session: SessionAPI
}
```

## `PromptAPI`

```typescript
interface PromptAPI {
  text: (opts: TextOpts) => Promise<string>
  confirm: (opts: ConfirmOpts) => Promise<boolean>
  select: <T>(opts: SelectOpts<T>) => Promise<T>
  multiselect: <T>(opts: MultiSelectOpts<T>) => Promise<T[]>
  password: (opts: PasswordOpts) => Promise<string>
  spinner: (opts: SpinnerOpts) => SpinnerAPI
}
```

### `SpinnerAPI`

```typescript
interface SpinnerAPI {
  message: (text: string) => void
  succeed: (text?: string) => void
  fail: (text?: string) => void
  warn: (text?: string) => void
  stop: () => void
}
```

## `LoggerAPI`

```typescript
interface LoggerAPI {
  info: (...args: unknown[]) => void
  success: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
  debug: (...args: unknown[]) => void
  raw: (...args: unknown[]) => void
  table: (data: Record<string, unknown>[], columns?: ColumnDef[]) => void
}
```

## `Theme`

```typescript
interface Theme {
  name: string
  colors: ThemeColors
  spinner: ThemeSpinner
  border: ThemeBorder
  icons: ThemeIcons
}
```

## `bcliTest` (from `bcli/test`)

```typescript
import { bcliTest } from 'bcli/test'

async function bcliTest(
  command: CommandDefinition,
  rawArgs?: string[],
  overrides?: TestOverrides,
): Promise<BcliTestResult>
```

See [Testing](/testing) for usage.

## `builtinThemes`

```typescript
import { builtinThemes } from 'bcli'

builtinThemes.nord
builtinThemes.dracula
builtinThemes['one-dark']
builtinThemes.minimal
```

## `resolveTheme`

```typescript
import { resolveTheme } from 'bcli'

function resolveTheme(nameOrTheme: string | Theme | undefined): Theme
```
