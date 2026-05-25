# Commands

Commands are the building blocks of your CLI. Each file in `src/commands/` exports one command.

## Defining a Command

```typescript
import { defineCommand } from 'bcli'

export default defineCommand({
  description: 'Build the project',
  args: {
    target: { type: 'string', description: 'Build target', default: 'dev' },
  },
  flags: {
    watch: { type: 'boolean', alias: 'w', description: 'Watch mode' },
  },
  run: async ({ args, flags, prompt, logger }) => {
    logger.info(`Building for ${args.target}...`)

    const spinner = prompt.spinner({ message: 'Compiling...' })
    await new Promise(r => setTimeout(r, 2000))
    spinner.succeed('Done!')

    if (flags.watch) {
      logger.info('Watching for changes...')
    }
  },
})
```

## Command Context

The `run` function receives a context object with everything you need:

```typescript
interface CommandContext {
  args: ParsedArgs           // Positional arguments
  flags: ParsedArgs          // Command-specific flags
  globalFlags: ParsedArgs    // Global flags (from config)
  command: ResolvedCommand   // Current command metadata
  config: CraftConfig        // Your bcli.config.ts
  prompt: PromptAPI          // Interactive prompts
  logger: LoggerAPI          // Logging utilities
  session: SessionAPI        // Start/stop lifecycle
}
```

## Arguments

Define positional arguments in order:

```typescript
args: {
  input:  { type: 'string', required: true, description: 'Input file' },
  output: { type: 'string', description: 'Output file', default: './dist' },
}
```

### Argument options

| Option | Type | Description |
|--------|------|-------------|
| `type` | `'string' \| 'number' \| 'boolean'` | Value type |
| `required` | `boolean` | Is it required? |
| `default` | same as type | Default value |
| `description` | `string` | Help text |
| `choices` | `string[]` | Allowed values |

## Flags

Flags are `--name` or `-a` style options:

```typescript
flags: {
  verbose: { type: 'boolean', alias: 'V', description: 'Verbose' },
  port:    { type: 'number',  alias: 'p', description: 'Port', default: 3000 },
  config:  { type: 'string',  alias: 'c', description: 'Config path' },
}
```

Usage:

```bash
my-cli build --port 8080 --verbose
my-cli build -p 8080 -V
my-cli build --config=prod.json
```

### Flag options

Same as arguments, plus:

| Option | Type | Description |
|--------|------|-------------|
| `alias` | `string` | Single-character short flag (e.g. `'V'` for `--verbose`) |

## Returning Values

Commands can return data — useful for piping or testing:

```typescript
run: async ({ logger }) => {
  const result = { status: 'ok', files: 42 }
  logger.table([result])
  return result
}
```
