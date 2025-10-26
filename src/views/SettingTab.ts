import { App, PluginSettingTab, Setting } from "obsidian";
import LiteCitePlugin from "../main.ts";

export class LiteCiteSettingTab extends PluginSettingTab {
  plugin: LiteCitePlugin;

  constructor(app: App, plugin: LiteCitePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    const information = containerEl.createEl("strong");
    information.createSpan({ text: "This plugin uses" });
    information.createEl("a", { text: " Eta", href: "https://eta.js.org/" });
    information.createSpan({
      text: " for templating. See the documentation for syntax.",
    });

    new Setting(containerEl)
      .setName("BibTeX file path or url")
      .setDesc("Path to your BibTeX file or URL to remote file")
      .addText((text) => {
        text
          .setPlaceholder(
            "e.g., references.bib or https://example.com/references.bib",
          )
          .setValue(this.plugin.settings.bibtexPath || "")
          .onChange(async (value) => {
            this.plugin.settings.bibtexPath = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName("Template file path")
      .setDesc(
        "Path to your note template file. Leave empty to use default template.",
      )
      .addText((text) =>
        text
          .setPlaceholder("e.g., Templates/Reference.md")
          .setValue(this.plugin.settings.templatePath || "")
          .onChange(async (value) => {
            this.plugin.settings.templatePath = value || undefined;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Note folder")
      .setDesc("Folder where citation notes will be created")
      .addText((text) =>
        text
          .setPlaceholder(
            "e.g., References or Literature",
          )
          .setValue(this.plugin.settings.noteFolder)
          .onChange(async (value) => {
            this.plugin.settings.noteFolder = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Filename template")
      .setDesc("Template for note filenames..")
      .addText((text) =>
        text
          .setPlaceholder("e.g., <%= it.fields.title %> or <%= it.citeKey %>")
          .setValue(this.plugin.settings.filenameTemplate || "<%= citeKey %>")
          .onChange(async (value) => {
            this.plugin.settings.filenameTemplate = value || "<%= citeKey %>";
            await this.plugin.saveSettings();
          })
      );
  }
}
