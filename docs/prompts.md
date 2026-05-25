# Interactive Prompts

bcli comes with 6 built-in prompts. They're themed, cancellable, and fully typed.

## Text

```typescript
const name = await prompt.text({
  message: 'What is your name?',
  placeholder: 'Enter your name',
  initial: 'User',
  validate: (v) => v.length < 2 ? 'Too short!' : undefined,
})
```

## Password

```typescript
const secret = await prompt.password({
  message: 'Enter your API key:',
  validate: (v) => v.length < 8 ? 'Key too short' : undefined,
})
```

> Input is masked with `*` characters in real-time.

## Select

```typescript
const color = await prompt.select({
  message: 'Pick a color',
  options: [
    { label: 'Red',   value: 'red',   hint: '(warm)' },
    { label: 'Green', value: 'green', hint: '(nature)' },
    { label: 'Blue',  value: 'blue',  hint: '(calm)' },
  ],
  initial: 'green',
})
```

Navigate with **arrow keys**, confirm with **Enter**.

## Multiselect

```typescript
const features = await prompt.multiselect({
  message: 'Select features:',
  options: [
    { label: 'Logging',   value: 'logging',   hint: '(detailed logs)' },
    { label: 'Analytics', value: 'analytics', hint: '(track usage)' },
    { label: 'Cache',     value: 'cache',     hint: '(faster)' },
  ],
  initial: ['logging'],
})
```

Toggle with **space**, confirm with **Enter**.

## Confirm

```typescript
const proceed = await prompt.confirm({
  message: 'Continue?',
  initial: true,
})
```

Toggle with **arrow keys**, confirm with **Enter**.

## Spinner

```typescript
const spinner = prompt.spinner({ message: 'Loading...' })

// Update the message
spinner.message('Still working...')

// Finish states
spinner.succeed('Done!')
spinner.fail('Failed!')
spinner.warn('Warning!')
```

The spinner automatically shows/hides based on terminal capabilities.

## Cancellation

Users can press `Ctrl+C` to cancel any prompt. The process exits cleanly.

## Non-TTY Fallback

When running in pipes or CI (non-TTY), prompts fall back to simple `readline` input:

```bash
my-cli greet < input.txt   # Works in pipes
my-cli greet | cat          # Works in pipes
```
