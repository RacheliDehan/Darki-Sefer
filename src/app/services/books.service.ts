import { Injectable, signal } from '@angular/core';
import { Book } from '../models/book.model';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class BooksService {
  private _books = signal<Book[]>([]);
  public readonly books = this._books;
  private _loaded = false;

  async loadBooks(): Promise<Book[]> {
    if (this._loaded) {
      return this._books();
    }

const resp = await fetch('/assets/data/Books.JSON');
    if (!resp.ok) {
      throw new Error(`Failed to load books: ${resp.status}`);
    }

    const data = (await resp.json()) as Book[];
    this._books.set(data);
    this._loaded = true;
    return this._books();
  }

  getBookById(id: string): Book | undefined {
    return this._books().find(b => b.id === id);
  }

  getCategories(): Category[] {
    const catsMap = new Map<string, Category>();
    for (const book of this._books()) {
      for (const cat of book.categories) {
        if (!catsMap.has(cat.id)) {
          catsMap.set(cat.id, cat);
        }
      }
    }
    return Array.from(catsMap.values());
  }

  searchBooks(query: string): Book[] {
    const q = query.trim().toLowerCase();
    if (!q) {
      return this._books();
    }
    return this._books().filter(b => {
      return (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q)
      );
    });
  }

  filterByCategory(categoryId: string): Book[] {
    if (!categoryId) {
      return this._books();
    }
    return this._books().filter(b => b.categories.some(c => c.id === categoryId));
  }
}
