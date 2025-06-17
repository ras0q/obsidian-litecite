import { BibtexEntry, parseBibtex } from "@ras0q/regex-bibtex-parser";
import { Eta } from "eta";
import { App, normalizePath, TFile } from "obsidian";
import { LiteCitePluginSettings } from "../settings/settings.ts";

const DEFAULT_TEMPLATE = `---
title: "<%= it.fields.title %>"
aliases:
  - "<%= it.citeKey %>"
author: "<%= it.fields.author %>"
date: "<%= it.fields.year %>"
tags:
  - "reference/<%= it.type %>"
created: "<%= new Date().toISOString() %>"
---

# <%= it.fields.title %>

## Abstract

<%= it.fields.abstract || "No abstract available." %>

## Notes
`;

export class BibtexManager {
  private app: App;
  private settings: LiteCitePluginSettings;
  private eta: Eta;

  constructor(app: App, settings: LiteCitePluginSettings) {
    this.app = app;
    this.settings = settings;
    this.eta = new Eta({
      autoEscape: false,
      autoTrim: false,
    });
  }

  updateSettings(settings: LiteCitePluginSettings): void {
    this.settings = settings;
  }

  async loadBibtexContent(): Promise<string> {
    const path = this.settings.bibtexPath;
    if (!path) {
      throw new Error("BibTeX path is not set. Configure it first.");
    }

    if (path.startsWith("http://") || path.startsWith("https://")) {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch bibtex file from ${path}: ${response.statusText}`,
        );
      }
      return await response.text();
    }

    const file = this.app.vault.getAbstractFileByPath(normalizePath(path));
    if (!file || !(file instanceof TFile)) {
      throw new Error(`BibTeX file not found: ${path}`);
    }
    return await this.app.vault.read(file);
  }

  async parseBibtexEntries(): Promise<BibtexEntry[]> {
    const content = await this.loadBibtexContent();
    return parseBibtex(content);
  }

  async ensureNoteExists(entry: BibtexEntry): Promise<TFile> {
    const folderPath = this.settings.noteFolder || "References";

    const folder = this.app.vault.getFolderByPath(normalizePath(folderPath));
    if (folder === null) {
      await this.app.vault.createFolder(folderPath);
    }

    const fileName = this.renderTemplate(
      this.settings.filenameTemplate || "<%= it.citeKey %>",
      entry,
      true,
    ) + ".md";
    const filePath = normalizePath(`${folderPath}/${fileName}`);

    const file = this.app.vault.getFileByPath(normalizePath(filePath));
    if (file !== null) {
      return file;
    }

    const templateContent = await this.loadTemplateContent();
    const noteContent = this.renderTemplate(templateContent, entry);

    return await this.app.vault.create(filePath, noteContent);
  }

  private renderTemplate(
    template: string,
    entry: BibtexEntry,
    sanitizeForFileName: boolean = false,
  ): string {
    const variables = {
      citeKey: entry.citeKey,
      type: entry.type,
      fields: entry.fields,
    };

    const result = this.eta.renderString(template, variables);
    return sanitizeForFileName ? this.sanitizeFileName(result) : result;
  }

  private sanitizeFileName(fileName: string): string {
    return fileName.replace(/[<>:"/\\|?*]/g, "_");
  }

  private async loadTemplateContent(): Promise<string> {
    if (!this.settings.templatePath) {
      return DEFAULT_TEMPLATE;
    }

    const path = this.settings.templatePath;

    const file = this.app.vault.getAbstractFileByPath(normalizePath(path));
    if (!file || !(file instanceof TFile)) {
      throw new Error(`Template file not found: ${path}`);
    }

    return await this.app.vault.read(file);
  }
}
