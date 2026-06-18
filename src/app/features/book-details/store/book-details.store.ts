import { Injectable, signal, computed, effect } from '@angular/core';
import { BooksService } from '../../../services/books.service';
import { PricingService } from '../../../services/pricing.service';
import { Book } from '../../../models/book.model';

@Injectable({ providedIn: 'root' })
export class BookDetailsStore {
  public readonly selectedBook = signal<Book | null>(null);
  public readonly quantity = signal<number>(1);

  public readonly calculatedPrice = computed(() => {
    const book = this.selectedBook();
    const qty = Math.max(1, Math.floor(this.quantity()));
    if (!book) {
      return 0;
    }
    return this.pricingService.calculateLineTotal(book, qty);
  });

  constructor(private booksService: BooksService, private pricingService: PricingService) {
    effect(() => {
      const book = this.selectedBook();
      if (book) {
        this.quantity.set(1);
      }
    });
  }

  async loadBook(id: string): Promise<void> {
    if (!id) {
      this.selectedBook.set(null);
      return;
    }
    if (!this.booksService.books().length) {
      await this.booksService.loadBooks();
    }
    const b = this.booksService.getBookById(id) ?? null;
    this.selectedBook.set(b);
  }
}
