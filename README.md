# Obsidian LiteCite

A lightweight Obsidian plugin that creates citation notes from a BibTeX / BibLaTeX file.

While this plugin might seem like a "re-invention of the wheel" for the [Citations] plugin, the it is no longer actively maintained. I've developed this new plugin to be **lighter, simpler, and faster**.

It leverages **Eta** as its templating engine and uses a **custom-built parser** for BibTeX entries.

This plugin is based on the [ras0q/obsidian-plugin-deno-template] template.

## Usage

1. Install and enable the plugin
2. Open the plugin settings and set the path to your BibTeX file
3. Use the command `LiteCite: Create note from BibTeX` to create a new note from a BibTeX entry

## Development

1. Install [Deno]
2. Run `deno task dev`, which will:
   - Clone the [sample vault] to `./vault-for-my-feature`
   - Build the plugin with live reload
3. Open the sample vault in Obsidian
4. Enable the plugin in Obsidian settings

### IDE Integration

VSCode

```json:settings.json
{
  "[css]": {
    "editor.defaultFormatter": "denoland.vscode-deno"
  },
  "[json]": {
    "editor.defaultFormatter": "denoland.vscode-deno"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "denoland.vscode-deno"
  },
  "[markdown]": {
    "editor.defaultFormatter": "denoland.vscode-deno"
  },
  "[typescript]": {
    "editor.defaultFormatter": "denoland.vscode-deno"
  },
  "[yaml]": {
    "editor.defaultFormatter": "denoland.vscode-deno"
  },
  "deno.enable": true,
  "deno.lint": true,
}
```

## Release

1. Update the version in `manifest.json`
2. Run `deno task build`, which will:
   - Build the plugin to `./dist`
3. Commit and push the changes to GitHub
4. Run `gh release create ./dist/main.js ./dist/manifest.json ./dist/styles.css`

[Citations]: https://github.com/hans/obsidian-citation-plugin
[ras0q/obsidian-plugin-deno-template]: https://github.com/ras0q/obsidian-plugin-deno-template
[Deno]: https://deno.com
[sample vault]: https://github.com/kepano/kepano-obsidian
