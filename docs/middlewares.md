# Middlewares

Middlewares let you run code before and after every command — perfect for auth, logging, config loading, and telemetry.

## Defining a Middleware

```typescript
import { defineMiddleware } from 'bcli'

export default defineMiddleware({
  phase: 'preRun',
  run: async (ctx) => {
    const start = Date.now()
    ctx.metadata = { start }

    // Store cleanup logic for postRun
    ctx.metadata.cleanup = () => {
      const duration = Date.now() - start
      ctx.logger.debug(`Command ran in ${duration}ms`)
    }
  },
})
```

## Middleware Phases

| Phase | When It Runs |
|-------|-------------|
| `init` | Before argument parsing |
| `preRun` | After parsing, before command execution |
| `postRun` | After command execution |
| `error` | When a command throws |

## Multiple Middlewares

Register them in `bcli.config.ts`:

```typescript
export default defineConfig({
  name: 'my-cli',
  middlewares: [
    authMiddleware,
    loggingMiddleware,
    telemetryMiddleware,
  ],
})
```

Order matters — they run in sequence.

## Context Mutations

Middlewares can modify the context:

```typescript
{
  phase: 'preRun',
  run: (ctx) => {
    // Add custom data to context
    ctx.config = { ...ctx.config, customField: true }
  },
}
```

## Error Middleware

Catch and format errors globally:

```typescript
{
  phase: 'error',
  run: (ctx) => {
    ctx.logger.error('Something went wrong!')
    ctx.session.stop(1)
  },
}
```
