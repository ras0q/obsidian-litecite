import { BibtexEntry } from "@ras0q/regex-bibtex-parser";
import { App, FuzzyMatch, FuzzySuggestModal, Notice } from "obsidian";
import { BibtexManager } from "../managers/BibtexManager.ts";

export class BibtexEntryFuzzyModal extends FuzzySuggestModal<BibtexEntry> {
  bibtexManager: BibtexManager;
  entries: BibtexEntry[];

  constructor(app: App, bibtexManager: BibtexManager, entries: BibtexEntry[]) {
    super(app);
    this.bibtexManager = bibtexManager;
    this.entries = entries;
  }

  override getItems(): BibtexEntry[] {
    return this.entries;
  }

  override getItemText(entry: BibtexEntry): string {
    const title = entry.fields.title || entry.citeKey;
    const author = entry.fields.author ? ` - ${entry.fields.author}` : "";
    const year = entry.fields.year ? ` (${entry.fields.year})` : "";
    return `${title}${author}${year}`;
  }

  override renderSuggestion(
    item: FuzzyMatch<BibtexEntry>,
    el: HTMLElement,
  ): void {
    const titleEl = el.createDiv();
    titleEl.setText(item.item.fields.title);

    const description = el.createEl("small");
    description.setText(
      `${item.item.fields.year || "????"} | ${
        item.item.fields.author || "Unknown Author"
      }`,
    );
  }

  onChooseItem(entry: BibtexEntry, _evt: MouseEvent | KeyboardEvent): void {
    this.createNoteFromEntry(entry);
  }

  async createNoteFromEntry(entry: BibtexEntry): Promise<void> {
    try {
      const newFile = await this.bibtexManager.createNoteFromEntry(entry);
      new Notice(`Created citation note: ${entry.citeKey}`);
      const leaf = this.app.workspace.getLeaf();
      leaf.openFile(newFile);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message
        : String(error);
      new Notice(`Error creating note: ${errorMessage}`);
      console.error("Error creating note:", error);
    }
  }
}
