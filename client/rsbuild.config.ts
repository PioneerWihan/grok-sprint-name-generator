import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginTypeCheck } from "@rsbuild/plugin-type-check";

export default defineConfig({
  plugins: [pluginReact(), pluginTypeCheck()],
  source: {
    entry: {
      index: "./src/index.tsx",
    },
  },
  html: {
    title: "Sprint Name Generator",
  },
});
