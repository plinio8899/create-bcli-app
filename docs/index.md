---
layout: home

title: bcli
titleTemplate: CLI framework for Node

hero:
  name: "bcli"
  text: "Build CLIs like a Pro"
  tagline: |
    Interactive prompts · File-system routing · Themes · Plugins · Testing
    All batteries included. Opinionated by design. 100% TypeScript.
  image:
    src: /create-bcli-app/terminal-hero.svg
    alt: Terminal
  actions:
    - theme: brand
      text: Quick Start
      link: /getting-started
    - theme: alt
      text: Why bcli?
      link: /structure
    - theme: alt
      text: GitHub
      link: https://github.com/plinio8899/create-bcli-app

features:
  - title: 🚀 Interactive Prompts
    details: "text, select, multiselect, confirm, password, spinner — all out of the box. No more wiring up readline manually."
    link: /prompts
  - title: 📁 File-System Routing
    details: "Commands map to your file tree: `src/commands/deploy/rollback.ts` → `my-cli deploy rollback`. Zero config."
    link: /routing
  - title: 🎨 4 Built-in Themes
    details: "Nord, Dracula, One Dark, Minimal. Or bring your own. Every prompt, spinner, border, and icon adapts."
    link: /themes
  - title: 🧪 Testing Included
    details: "`bcliTest()` captures stdout, mocks prompts, and validates output — no terminal required."
    link: /testing
  - title: 🔌 Plugin System
    details: "Extend any CLI with autocomplete, update checks, telemetry — plugins hook into the command lifecycle."
    link: /plugins
  - title: ⚡ TypeScript Native
    details: "Full type inference from config to commands. `defineConfig` and `defineCommand` are fully typed."
    link: /api
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: linear-gradient(135deg, #00d2ff, #4ade80);
  --vp-home-hero-image-background-image: linear-gradient(135deg, #00d2ff, #4ade80);
  --vp-home-hero-image-filter: blur(72px);
}

.VPHomeHero .name span {
  background: var(--vp-home-hero-name-background);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.VPHomeHero .tagline {
  white-space: pre-line;
  color: var(--vp-c-text-2);
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 1rem;
}

.VPHomeHero .image {
  filter: drop-shadow(0 0 24px rgba(0, 210, 255, 0.3));
}
</style>
