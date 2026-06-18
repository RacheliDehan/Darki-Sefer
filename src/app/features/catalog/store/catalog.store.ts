import { Injectable, signal, computed, effect } from '@angular/core';
import { BooksService } from '../../../services/books.service';
import { Book } from '../../../models/book.model';
import { Category } from '../../../models/category.model';

@Injectable({ providedIn: 'root' })
export class CatalogStore {
  public readonly books = signal<Book[]>([]);
  public readonly categories = signal<Category[]>([]);
  public readonly search = signal<string>('');
  public readonly selectedCategory = signal<string | null>(null);

  public readonly filteredBooks = computed(() => {
    const q = this.search().trim().toLowerCase();
    let list = this.books();
    if (this.selectedCategory()) {
      list = list.filter(b => b.categories.some(c => c.id === this.selectedCategory()));
    }
    if (q) {
      list = list.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
      );
    }
    return list;
  });

  constructor(private booksService: BooksService) {
    void this.initialize();

    effect(() => {
      const bs = this.books();
      const map = new Map<string, Category>();
      for (const book of bs) {
        for (const c of book.categories) {
          if (!map.has(c.id)) {
            map.set(c.id, c);
          }
        }
      }
      this.categories.set(Array.from(map.values()));
    });
  }

  private async initialize(): Promise<void> {
    const b = await this.booksService.loadBooks();
    this.books.set(b);
  }
}
