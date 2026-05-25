# Themes

bcli comes with 4 built-in themes. Every prompt, spinner, border, and icon adapts to the active theme.

## Built-in Themes

### Nord

A cold, arctic-inspired theme. The default.

```typescript
theme: 'nord'
```

### Dracula

A dark vampire-themed palette.

```typescript
theme: 'dracula'
```

### One Dark

Inspired by Atom's One Dark UI.

```typescript
theme: 'one-dark'
```

### Minimal

A no-frills monochrome theme. Great for CI output.

```typescript
theme: 'minimal'
```

## Custom Themes

Define your own:

```typescript
import { defineConfig } from 'bcli'
import type { Theme } from 'bcli'

const myTheme: Theme = {
  name: 'Retro',
  colors: {
    primary: '#ff6b6b',
    secondary: '#ffd93d',
    success: '#6bcb77',
    error: '#ff6b6b',
    warning: '#ffd93d',
    info: '#4d96ff',
    muted: '#666',
    border: '#444',
    text: '#e0e0e0',
    highlight: '#ffd93d',
  },
  spinner: {
    frames: ['|', '/', '-', '\\'],
    interval: 100,
  },
  border: {
    style: 'rounded',
    color: '#444',
    topLeft: '╭', topRight: '╮',
    bottomLeft: '╰', bottomRight: '╯',
    horizontal: '─', vertical: '│',
  },
  icons: {
    success: '✔', error: '✘', warning: '⚠', info: 'ℹ',
    bullet: '•', arrow: '▸', pointer: '❯',
    checkbox: '☐', checkboxChecked: '☑',
  },
}

export default defineConfig({
  name: 'my-cli',
  theme: myTheme,
})
```

## Theme Structure

```typescript
interface Theme {
  name: string
  colors: {
    primary: string    // Main accent color
    secondary: string  // Secondary accent
    success: string    // Success messages
    error: string      // Error messages
    warning: string    // Warning messages
    info: string       // Info messages
    muted: string      // Dim/muted text
    border: string     // Borders
    text: string       // Foreground text
    highlight: string  // Highlighted items
  }
  spinner: {
    frames: string[]   // Animation frames
    interval: number   // MS between frames
  }
  border: { /* style + characters */ }
  icons: { /* All icons */ }
}
```
