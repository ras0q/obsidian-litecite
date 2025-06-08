export interface LiteCitePluginSettings {
  bibtexPath?: string;
  templatePath?: string;
  noteFolder: string;
  filenameTemplate: string;
}

export const DEFAULT_SETTINGS: LiteCitePluginSettings = {
  noteFolder: "References",
  filenameTemplate: "<%= it.fields.title %>",
};
