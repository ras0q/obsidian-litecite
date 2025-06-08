import { Notice, Plugin } from "obsidian";
import {
  DEFAULT_SETTINGS,
  LiteCitePluginSettings,
} from "./settings/settings.ts";
import { BibtexManager } from "./managers/BibtexManager.ts";
import { BibtexEntryFuzzyModal } from "./views/BibtexEntryFuzzyModal.ts";
import { LiteCiteSettingTab } from "./views/SettingTab.ts";

export default class LiteCitePlugin extends Plugin {
  settings: LiteCitePluginSettings = DEFAULT_SETTINGS;
  bibtexManager: BibtexManager | null = null;

  override async onload() {
    await this.loadSettings();

    const bibtexManager = new BibtexManager(this.app, this.settings);
    this.bibtexManager = bibtexManager;

    this.addCommand({
      id: "create-note-from-bibtex",
      name: "Create note from BibTeX",
      callback: async () => {
        try {
          const entries = await bibtexManager.parseBibtexEntries();
          new BibtexEntryFuzzyModal(this.app, bibtexManager, entries)
            .open();
        } catch (error: unknown) {
          const errorMessage = error instanceof Error
            ? error.message
            : String(error);
          new Notice(`Error loading BibTeX: ${errorMessage}`);
          console.error("Error loading BibTeX:", error);
        }
      },
    });

    this.addSettingTab(new LiteCiteSettingTab(this.app, this));
  }

  override onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.bibtexManager?.updateSettings(this.settings);
  }
}
