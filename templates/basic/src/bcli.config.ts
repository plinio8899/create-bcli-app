import { defineConfig } from 'bcli'

export default defineConfig({
  name: 'my-cli',
  version: '0.1.0',
  description: 'A CLI built with bcli',
  theme: 'nord',
  commandsDir: './src/commands',
  flags: {
    verbose: { type: 'boolean', alias: 'V', description: 'Verbose output' },
  },
})
