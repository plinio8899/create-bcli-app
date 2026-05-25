#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { createInterface } from "node:readline";
import chalk from "chalk";

interface ScaffoldOpts {
  projectName: string;
  theme: string;
  packageManager: string;
  interactive: boolean;
}

const THEMES = ["nord", "dracula", "one-dark", "minimal"];
const PKG_MANAGERS = ["npm", "pnpm", "yarn", "bun"];

async function promptUser(): Promise<ScaffoldOpts> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const q = (query: string): Promise<string> =>
    new Promise((r) => rl.question(query, r));

  const projectName =
    (await q(`${chalk.cyan("?")} Project name: `)) || "my-cli";
  const theme =
    (await q(`${chalk.cyan("?")} Theme (${THEMES.join("/")}): `)) || "nord";
  const pmRaw =
    (await q(
      `${chalk.cyan("?")} Package manager (${PKG_MANAGERS.join("/")}): `,
    )) || "npm";
  const interactiveRaw =
    (await q(`${chalk.cyan("?")} Include interactive examples? (Y/n): `)) ||
    "y";

  rl.close();

  return {
    projectName: projectName.trim(),
    theme: THEMES.includes(theme) ? theme : "nord",
    packageManager: PKG_MANAGERS.includes(pmRaw) ? pmRaw : "npm",
    interactive: interactiveRaw.toLowerCase() !== "n",
  };
}

async function main() {
  const args = process.argv.slice(2);
  const _projectName = args[0] || "my-cli";

  console.log(chalk.bold("\n  create-bcli-app — Project Scaffold\n"));

  const opts = await promptUser();
  const targetDir = resolve(process.cwd(), opts.projectName);

  if (existsSync(targetDir)) {
    console.error(
      chalk.red(`\n  Error: Directory ${opts.projectName} already exists.`),
    );
    process.exit(1);
  }

  console.log(chalk.dim(`\n  Creating project in ${targetDir}...\n`));

  mkdirSync(targetDir, { recursive: true });

  // Create package.json
  writeFileSync(
    join(targetDir, "package.json"),
    JSON.stringify(
      {
        name: opts.projectName,
        version: "0.1.0",
        type: "module",
        description: "CLI built with bcli",
        main: "dist/index.js",
        types: "dist/index.d.ts",
        bin: {
          [opts.projectName.replace(/^@[^/]+\//, "")]: "./dist/cli.js",
        },
        scripts: {
          dev: "tsup --watch src/index.ts src/cli.ts --dts --format esm",
          build: "tsup src/index.ts src/cli.ts --dts --format esm --clean",
          start: "node dist/cli.js",
          typecheck: "tsc --noEmit",
          test: "vitest run",
        },
        dependencies: {
          bcli: "^0.1.0",
        },
        devDependencies: {
          tsup: "^8.1.0",
          typescript: "^5.5.0",
          vitest: "^2.0.0",
          "@types/node": "^20.14.0",
        },
      },
      null,
      2,
    ),
  );

  // Create tsconfig.json
  writeFileSync(
    join(targetDir, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          module: "ESNext",
          moduleResolution: "bundler",
          outDir: "./dist",
          rootDir: "./src",
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          declaration: true,
          sourceMap: true,
        },
        include: ["src"],
      },
      null,
      2,
    ),
  );

  // Create directory structure
  const srcDir = join(targetDir, "src");
  const commandsDir = join(srcDir, "commands");
  mkdirSync(commandsDir, { recursive: true });

  // Create bcli.config.ts
  writeFileSync(
    join(srcDir, "bcli.config.ts"),
    `import { defineConfig } from 'bcli'

export default defineConfig({
  name: '${opts.projectName}',
  version: '0.1.0',
  description: 'A CLI built with bcli',
  theme: '${opts.theme}',
  commandsDir: './src/commands',
  flags: {
    verbose: { type: 'boolean', alias: 'V', description: 'Verbose output' },
  },
})
`,
  );

  // Create index.ts (root command)
  if (opts.interactive) {
    writeFileSync(
      join(commandsDir, "index.ts"),
      `import { defineCommand } from 'bcli'

export default defineCommand({
  description: 'Welcome to ${opts.projectName}!',
  args: {
    name: { type: 'string', description: 'Your name', required: false },
  },
  run: async ({ args, prompt, logger }) => {
    const name = args.name as string || await prompt.text({
      message: 'What is your name?',
      placeholder: 'Enter your name',
    })

    const color = await prompt.select({
      message: 'Pick a color',
      options: [
        { label: 'Red', value: 'red' },
        { label: 'Green', value: 'green' },
        { label: 'Blue', value: 'blue' },
      ],
    })

    const features = await prompt.multiselect({
      message: 'Select features',
      options: [
        { label: 'Logging', value: 'logging' },
        { label: 'Analytics', value: 'analytics' },
        { label: 'Cache', value: 'cache' },
      ],
    })

    const confirmed = await prompt.confirm({
      message: \`Continue with name="\${name}", color="\${color}", features=(\${features.join(', ')})?\`,
      initial: true,
    })

    if (confirmed) {
      logger.success(\`Hello \${name}! Setup complete.\`)
    } else {
      logger.info('Cancelled')
    }
  },
})
`,
    );
  } else {
    writeFileSync(
      join(commandsDir, "index.ts"),
      `import { defineCommand } from 'bcli'

export default defineCommand({
  description: 'Welcome to ${opts.projectName}!',
  run: async ({ args, flags, logger }) => {
    logger.success('Hello from ${opts.projectName}!')
    logger.info('Run with --help to see available options.')
  },
})
`,
    );
  }

  // Create build command
  writeFileSync(
    join(commandsDir, "build.ts"),
    `import { defineCommand } from 'bcli'

export default defineCommand({
  description: 'Build the project',
  args: {
    target: { type: 'string', description: 'Target environment', choices: ['dev', 'prod'], default: 'dev' },
  },
  run: async ({ args, flags, prompt, logger }) => {
    const spinner = prompt.spinner({ message: \`Building for \${args.target}...\` })
    await new Promise(r => setTimeout(r, 1500))
    spinner.succeed('Build complete!')
  },
})
`,
  );

  // Create test file
  writeFileSync(
    join(srcDir, "index.test.ts"),
    `import { describe, it, expect } from 'vitest'

describe('${opts.projectName}', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2)
  })
})
`,
  );

  // Create .gitignore
  writeFileSync(
    join(targetDir, ".gitignore"),
    `node_modules
dist
*.tsbuildinfo
.env
`,
  );

  // Install dependencies
  console.log(
    chalk.dim(`\n  Installing dependencies with ${opts.packageManager}...\n`),
  );

  const { execSync } = await import("node:child_process");
  try {
    execSync(`${opts.packageManager} install`, {
      cwd: targetDir,
      stdio: "inherit",
    });
  } catch {
    console.warn(
      chalk.yellow(
        "  Warning: Could not install dependencies. Run `npm install` manually.",
      ),
    );
  }

  console.log(chalk.green(`\n  ✅ Project "${opts.projectName}" created!\n`));
  console.log(chalk.bold("  Next steps:"));
  console.log(`    cd ${opts.projectName}`);
  console.log(`    ${opts.packageManager} run dev`);
  console.log(`    ${opts.packageManager} start\n`);
}

main().catch((err) => {
  console.error(chalk.red(String(err)));
  process.exit(1);
});
