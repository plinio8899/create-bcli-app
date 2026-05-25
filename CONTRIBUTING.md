# Contributing

Thanks for your interest in contributing to create-bcli-app!

## Development Setup

```bash
git clone <repo>
cd create-bcli-app
npm install
npm run build
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build the framework |
| `npm run dev` | Watch mode |
| `npm test` | Run tests |
| `npm run lint` | Check code style |
| `npm run format` | Format code |
| `npm run typecheck` | TypeScript check |
| `npm run docs:dev` | Start docs site locally |

## Project Structure

```
src/
  core/       Framework core (config, commands, types)
  parser/     CLI argument/flag parser
  router/     File-system command routing
  prompts/    Interactive prompts
  theme/      Theme system
  output/     Logger, session
  utils/      ANSI, keypress, autocomplete
  test/       Testing utilities
docs/         VitePress documentation site
templates/    Scaffolding templates
```

## Pull Requests

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Run `npm run build && npm test`
5. Submit a PR

## License

By contributing, you agree that your contributions will be licensed under MIT.
