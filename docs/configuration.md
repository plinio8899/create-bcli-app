# Configuration

All configuration lives in `bcli.config.ts` at your project root.

## Reference

```typescript
import { defineConfig } from 'bcli'

export default defineConfig({
  name: string,
  version: string,
  description?: string,
  theme?: string,
  commandsDir?: string,
  flags?: Record<string, FlagDefinition>,
  middlewares?: MiddlewareDefinition[],
  plugins?: PluginDefinition[],
  bin?: string,
})
```

## Fields

### `name` (required)

Your CLI's display name. Used in help output and version messages.

```typescript
name: 'my-cli'
```

### `version` (required)

Displayed when users run `my-cli --version`.

```typescript
version: '1.0.0'
```

### `theme`

One of the built-in themes or a custom [Theme](/themes) object.

```typescript
theme: 'nord'           // String — picks a built-in theme
theme: myCustomTheme    // Object — custom theme
```

Defaults to `'nord'`.

### `commandsDir`

Path to your commands directory, relative to project root.

```typescript
commandsDir: './src/commands'
```

Defaults to `'./src/commands'`.

### `flags`

Global flags available to every command.

```typescript
flags: {
  verbose: {
    type: 'boolean',
    alias: 'V',
    description: 'Enable verbose logging',
  },
  config: {
    type: 'string',
    alias: 'c',
    description: 'Path to config file',
    default: './config.json',
  },
}
```

### `middlewares`

Lifecycle hooks that run before/after every command.

```typescript
middlewares: [
  {
    phase: 'preRun',
    run: (ctx) => { /* check auth, load config, etc */ },
  },
]
```

### `plugins`

Extend your CLI with reusable functionality.

```typescript
plugins: [
  autoCompletePlugin(),
  updateNotifierPlugin(),
]
```
