import { defineConfig, globalIgnores } from "eslint/config";
import obsidianmdPlugin from "eslint-plugin-obsidianmd";
import globals from "globals";
import { globSync } from "node:fs";

export default defineConfig([
  globalIgnores(["./dist/*"]),
  ...obsidianmdPlugin.configs.recommended,
  // Deno compat
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        projectService: {
          // NOTE: In, allowDefaultProject, `**` cannot be used.
          allowDefaultProject: globSync("**/*.{ts,tsx}")
            .map((p) => p.replaceAll(/\\/g, "/")),
        },
      },
    },
    rules: {
      // NOTE: These rules can only be enabled when using package.json instead of deno.json.
      "import/no-extraneous-dependencies": "off",
      "import/no-nodejs-modules": "off",
    },
  },
]);
