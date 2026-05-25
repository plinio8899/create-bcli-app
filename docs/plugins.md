# Plugins

Plugins extend your CLI's capabilities. They can add commands, modify config, hook into lifecycle events, and more.

## Using a Plugin

```typescript
import { defineConfig } from 'bcli'
import autoComplete from 'bcli-plugin-autocomplete'
import updateNotifier from 'bcli-plugin-update'

export default defineConfig({
  name: 'my-cli',
  version: '1.0.0',
  plugins: [
    autoComplete(),
    updateNotifier(),
  ],
})
```

## Writing a Plugin

```typescript
import { definePlugin } from 'bcli'

export default definePlugin({
  name: 'my-plugin',
  setup: (config) => {
    // Modify config
    config.middlewares = config.middlewares ?? []
    config.middlewares.push({
      phase: 'preRun',
      run: (ctx) => {
        console.log('Plugin hook running!')
      },
    })

    // Return modified config
    return config
  },
})
```

## Plugin API

```typescript
interface PluginDefinition {
  name: string
  setup: (config: CraftConfig) => CraftConfig | void
}
```

## Official Plugins

| Plugin | Description |
|--------|-------------|
| `bcli-plugin-autocomplete` | Shell autocomplete (bash/zsh/fish) |
| `bcli-plugin-update` | Check for updates on npm |
| `bcli-plugin-telemetry` | Anonymous usage analytics |

## Publishing Plugins

Publish your plugin as an npm package with the `bcli-plugin-` prefix:

```
bcli-plugin-<name>
```

Users just install and add to their config.
