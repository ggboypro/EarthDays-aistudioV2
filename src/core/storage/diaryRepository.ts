import { Ledger } from '../types/ledger';
import { DiaryEntry } from '../types/diary';
import { Memory, BookDraft } from '../types/book';
import { INITIAL_LEDGERS, INITIAL_ENTRIES } from './initialSeed';
import { INITIAL_MEMORIES, INITIAL_BOOKS } from './bookSeed';

const STORAGE_KEY_LEDGERS = 'earth_diary_ledgers_v1';
const STORAGE_KEY_ENTRIES = 'earth_diary_entries_v1';
const STORAGE_KEY_CURRENT_LEDGER = 'earth_diary_current_ledger_id_v1';
const STORAGE_KEY_MEMORIES = 'earth_diary_memories_v1';
const STORAGE_KEY_BOOKS = 'earth_diary_books_v1';
const STORAGE_KEY_ICLOUD = 'earth_diary_icloud_sync_enabled';

class DiaryRepository {
  private ledgers: Ledger[] = [];
  private entries: DiaryEntry[] = [];
  private memories: Memory[] = [];
  private books: BookDraft[] = [];
  private currentLedgerId: string = 'ledger_my_days';
  private icloudSync: boolean = true;
  private listeners: Array<() => void> = [];

  constructor() {
    this.load();
  }

  private load() {
    try {
      const savedLedgers = localStorage.getItem(STORAGE_KEY_LEDGERS);
      const savedEntries = localStorage.getItem(STORAGE_KEY_ENTRIES);
      const savedCurrentId = localStorage.getItem(STORAGE_KEY_CURRENT_LEDGER);
      const savedMemories = localStorage.getItem(STORAGE_KEY_MEMORIES);
      const savedBooks = localStorage.getItem(STORAGE_KEY_BOOKS);
      const savedIcloud = localStorage.getItem(STORAGE_KEY_ICLOUD);

      if (savedEntries) {
        const parsed = JSON.parse(savedEntries);
        if (parsed.length < 20) {
          this.entries = [...INITIAL_ENTRIES];
          this.saveEntries();
        } else {
          this.entries = parsed;
        }
      } else {
        this.entries = [...INITIAL_ENTRIES];
        this.saveEntries();
      }

      if (savedLedgers) {
        const parsedLedgers = JSON.parse(savedLedgers);
        if (parsedLedgers.length < 5) {
          this.ledgers = [...INITIAL_LEDGERS];
          this.saveLedgers();
        } else {
          this.ledgers = parsedLedgers;
        }
      } else {
        this.ledgers = [...INITIAL_LEDGERS];
        this.saveLedgers();
      }

      if (savedMemories) {
        this.memories = JSON.parse(savedMemories);
      } else {
        this.memories = [...INITIAL_MEMORIES];
        this.saveMemories();
      }

      if (savedBooks) {
        this.books = JSON.parse(savedBooks);
      } else {
        this.books = [...INITIAL_BOOKS];
        this.saveBooks();
      }

      if (savedIcloud !== null) {
        this.icloudSync = savedIcloud === 'true';
      }

      if (savedCurrentId && this.ledgers.some(l => l.id === savedCurrentId)) {
        this.currentLedgerId = savedCurrentId;
      } else {
        this.currentLedgerId = this.ledgers[0]?.id || 'ledger_my_days';
      }
    } catch (e) {
      console.error('Failed to load from storage, using defaults:', e);
      this.ledgers = [...INITIAL_LEDGERS];
      this.entries = [...INITIAL_ENTRIES];
      this.memories = [...INITIAL_MEMORIES];
      this.books = [...INITIAL_BOOKS];
      this.currentLedgerId = 'ledger_my_days';
    }
  }

  private saveLedgers() {
    try {
      localStorage.setItem(STORAGE_KEY_LEDGERS, JSON.stringify(this.ledgers));
    } catch (e) {
      console.error('Failed to save ledgers', e);
    }
  }

  private saveEntries() {
    try {
      localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(this.entries));
    } catch (e) {
      console.error('Failed to save entries', e);
    }
  }

  private saveMemories() {
    try {
      localStorage.setItem(STORAGE_KEY_MEMORIES, JSON.stringify(this.memories));
    } catch (e) {
      console.error('Failed to save memories', e);
    }
  }

  private saveBooks() {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(this.books));
    } catch (e) {
      console.error('Failed to save books', e);
    }
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Ledger queries
  public getLedgers(): Ledger[] {
    return [...this.ledgers];
  }

  public getCurrentLedger(): Ledger {
    const found = this.ledgers.find(l => l.id === this.currentLedgerId);
    return found || this.ledgers[0] || INITIAL_LEDGERS[0];
  }

  public setCurrentLedgerId(id: string) {
    if (this.ledgers.some(l => l.id === id)) {
      this.currentLedgerId = id;
      try {
        localStorage.setItem(STORAGE_KEY_CURRENT_LEDGER, id);
      } catch (e) {
        // ignore
      }
      this.notify();
    }
  }

  public addLedger(ledger: Ledger) {
    this.ledgers.push(ledger);
    this.saveLedgers();
    this.setCurrentLedgerId(ledger.id);
    this.notify();
  }

  // Diary Entry queries
  public getEntriesByLedger(ledgerId?: string): DiaryEntry[] {
    const targetId = ledgerId || this.currentLedgerId;
    return this.entries
      .filter(e => e.ledgerId === targetId)
      .sort((a, b) => new Date(b.diaryDate).getTime() - new Date(a.diaryDate).getTime());
  }

  public getAllEntries(): DiaryEntry[] {
    return [...this.entries].sort(
      (a, b) => new Date(b.diaryDate).getTime() - new Date(a.diaryDate).getTime()
    );
  }

  public getEntryById(id: string): DiaryEntry | undefined {
    return this.entries.find(e => e.id === id);
  }

  public addEntry(entry: DiaryEntry) {
    this.entries.unshift(entry);
    const ledger = this.ledgers.find(l => l.id === entry.ledgerId);
    if (ledger) {
      ledger.entryCount += 1;
      ledger.updatedAt = new Date().toISOString();
      this.saveLedgers();
    }
    this.saveEntries();
    this.notify();
  }

  public updateEntry(updated: DiaryEntry) {
    this.entries = this.entries.map(e => e.id === updated.id ? updated : e);
    this.saveEntries();
    this.notify();
  }

  public toggleFavorite(id: string) {
    const entry = this.entries.find(e => e.id === id);
    if (entry) {
      entry.isFavorite = !entry.isFavorite;
      this.saveEntries();
      this.notify();
    }
  }

  public deleteEntry(id: string) {
    const entry = this.entries.find(e => e.id === id);
    if (entry) {
      const ledger = this.ledgers.find(l => l.id === entry.ledgerId);
      if (ledger && ledger.entryCount > 0) {
        ledger.entryCount -= 1;
        this.saveLedgers();
      }
      this.entries = this.entries.filter(e => e.id !== id);
      this.saveEntries();
      this.notify();
    }
  }

  // Memories
  public getMemories(): Memory[] {
    return [...this.memories];
  }

  public getMemoryById(id: string): Memory | undefined {
    return this.memories.find(m => m.id === id);
  }

  public addMemory(memory: Memory) {
    this.memories.unshift(memory);
    this.saveMemories();
    this.notify();
  }

  public deleteMemory(id: string) {
    this.memories = this.memories.filter(m => m.id !== id);
    this.saveMemories();
    this.notify();
  }

  // Books
  public getBooks(): BookDraft[] {
    return [...this.books];
  }

  public getBookById(id: string): BookDraft | undefined {
    return this.books.find(b => b.id === id);
  }

  public saveBook(book: BookDraft) {
    const idx = this.books.findIndex(b => b.id === book.id);
    if (idx >= 0) {
      this.books[idx] = book;
    } else {
      this.books.unshift(book);
    }
    this.saveBooks();
    this.notify();
  }

  public deleteBook(id: string) {
    this.books = this.books.filter(b => b.id !== id);
    this.saveBooks();
    this.notify();
  }

  // iCloud & Settings
  public isIcloudEnabled(): boolean {
    return this.icloudSync;
  }

  public setIcloudEnabled(enabled: boolean) {
    this.icloudSync = enabled;
    try {
      localStorage.setItem(STORAGE_KEY_ICLOUD, String(enabled));
    } catch (e) {
      // ignore
    }
    this.notify();
  }

  public resetToDefault() {
    this.ledgers = [...INITIAL_LEDGERS];
    this.entries = [...INITIAL_ENTRIES];
    this.memories = [...INITIAL_MEMORIES];
    this.books = [...INITIAL_BOOKS];
    this.currentLedgerId = 'ledger_my_days';
    this.icloudSync = true;
    this.saveLedgers();
    this.saveEntries();
    this.saveMemories();
    this.saveBooks();
    try {
      localStorage.setItem(STORAGE_KEY_ICLOUD, 'true');
    } catch (e) {
      // ignore
    }
    this.notify();
  }
}

export const diaryRepo = new DiaryRepository();
