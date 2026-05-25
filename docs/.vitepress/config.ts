import { defineConfig } from "vitepress";

export default defineConfig({
  title: "bcli",
  description:
    "Opinionated framework for building interactive CLI apps — by Billy",

  lang: "en-US",

  base: "/create-bcli-app/",

  cleanUrls: true,

  head: [
    ["meta", { property: "og:title", content: "bcli — CLI framework" }],
    [
      "meta",
      {
        property: "og:description",
        content:
          "Build interactive CLIs with config, prompts, themes, plugins, testing — all batteries included.",
      },
    ],
    ["meta", { property: "og:url", content: "https://plinio8899.github.io/create-bcli-app/" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:title", content: "bcli — CLI framework" }],
    [
      "meta",
      {
        name: "twitter:description",
        content:
          "Build interactive CLIs with config, prompts, themes, plugins, testing — all batteries included.",
      },
    ],
    ["link", { rel: "icon", href: "/create-bcli-app/favicon.svg" }],
  ],

  lastUpdated: true,

  themeConfig: {
    logo: "/create-bcli-app/favicon.svg",

    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/getting-started" },
      { text: "API", link: "/api" },
      { text: "GitHub", link: "https://github.com/plinio8899/create-bcli-app" },
    ],

    sidebar: [
      {
        text: "Getting Started",
        items: [
          { text: "Installation", link: "/getting-started" },
          { text: "CLI Structure", link: "/structure" },
          { text: "Configuration", link: "/configuration" },
        ],
      },
      {
        text: "Core Concepts",
        items: [
          { text: "Commands", link: "/commands" },
          { text: "Arguments & Flags", link: "/args-flags" },
          { text: "File System Routing", link: "/routing" },
          { text: "Middlewares", link: "/middlewares" },
          { text: "Plugins", link: "/plugins" },
        ],
      },
      {
        text: "Interactive Prompts",
        items: [
          { text: "Overview", link: "/prompts" },
          { text: "Text & Password", link: "/prompts#text" },
          { text: "Select & Multiselect", link: "/prompts#select" },
          { text: "Confirm", link: "/prompts#confirm" },
          { text: "Spinner", link: "/prompts#spinner" },
        ],
      },
      {
        text: "Theming",
        link: "/themes",
      },
      {
        text: "Testing",
        link: "/testing",
      },
      {
        text: "CLI Reference",
        link: "/cli",
      },
      {
        text: "API Reference",
        link: "/api",
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/plinio8899/create-bcli-app" },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright 2026 Plinio — Built with bcli itself, of course.",
    },

    search: {
      provider: "local",
    },
  },
});
