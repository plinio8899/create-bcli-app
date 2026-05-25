# Testing

bcli includes built-in test utilities. No terminal required.

## Basic Test

```typescript
import { describe, it, expect } from 'vitest'
import { bcliTest } from 'bcli/test'
import myCommand from '../src/commands/index.js'

describe('my command', () => {
  it('greets the user', async () => {
    const { stdout, ctx } = await bcliTest(myCommand)

    // Prompts are auto-mocked
    expect(stdout).toContain('Hello')
    expect(stdout).toContain('mocked-text')
  })
})
```

## Custom Mock Answers

Override the default mock prompt values:

```typescript
const { stdout } = await bcliTest(myCommand, ['--flag', 'value'], {
  config: { theme: 'minimal' },
  globalFlags: { verbose: true },
})
```

## Testing with Flags

Pass raw CLI arguments:

```typescript
const { stdout } = await bcliTest(myCommand, [
  '--name', 'Billy',
  '--verbose',
])
```

## Assertion Examples

```typescript
it('outputs a table', async () => {
  const { stdout } = await bcliTest(buildCommand)
  expect(stdout).toContain('File')
  expect(stdout).toContain('index.js')
})

it('shows spinners', async () => {
  const { stdout } = await bcliTest(deployCommand)
  expect(stdout).toContain('Building')
  expect(stdout).toContain('Done!')
})

it('handles errors', async () => {
  const { stderr } = await bcliTest(badCommand)
  expect(stderr).toContain('Error')
})
```

## Test API

```typescript
async function bcliTest(
  command: CommandDefinition,
  rawArgs?: string[],
  overrides?: {
    config?: Partial<CraftConfig>,
    globalFlags?: ParsedArgs,
  },
): Promise<{
  stdout: string
  stderr: string
  ctx: CommandContext
  output: unknown
}>
```
