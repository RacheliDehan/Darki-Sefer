import { Injectable, signal } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { BooksService } from './books.service';
import { InventoryService } from './inventory.service';
import { PricingService } from './pricing.service';
import { Book } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>([]);
  public readonly items = this._items;

  constructor(
    private booksService: BooksService,
    private inventoryService: InventoryService,
    private pricingService: PricingService
  ) {}

  private findIndex(bookId: string): number {
    return this._items().findIndex(i => i.bookId === bookId);
  }

  addItem(bookId: string, quantity: number): void {
    const book = this.booksService.getBookById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }

    if (!this.inventoryService.canOrder(book, quantity)) {
      throw new Error('Insufficient stock');
    }

    const idx = this.findIndex(bookId);
    const now = new Date().toISOString();
    if (idx === -1) {
      const unitPrice = this.pricingService.getUnitPrice(book, quantity);
      const item: CartItem = {
        bookId,
        book,
        quantity,
        unitPrice,
        currency: book.currency,
        totalPrice: unitPrice * quantity,
        addedAt: now
      };
      this._items.update(list => [...list, item]);
      return;
    }

    // merge quantities
    this._items.update(list => {
      const copy = list.slice();
      const existing = { ...copy[idx] };
      const newQty = existing.quantity = quantity;
      if (!this.inventoryService.canOrder(book, newQty)) {
        throw new Error('Insufficient stock for requested quantity');
      }
      existing.quantity = newQty;
      existing.unitPrice = this.pricingService.getUnitPrice(book, newQty);
      existing.totalPrice = existing.unitPrice * existing.quantity;
      copy[idx] = existing;
      return copy;
    });
  }

  removeItem(bookId: string): void {
    this._items.update(list => list.filter(i => i.bookId !== bookId));
  }

  updateQuantity(bookId: string, quantity: number): void {
    const book = this.booksService.getBookById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }
    if (!this.inventoryService.canOrder(book, quantity)) {
      throw new Error('Insufficient stock');
    }
    this._items.update(list => {
      const copy = list.slice();
      const idx = copy.findIndex(i => i.bookId === bookId);
      if (idx === -1) {
        throw new Error('Cart item not found');
      }
      const existing = { ...copy[idx] };
      existing.quantity = quantity;
      existing.unitPrice = this.pricingService.getUnitPrice(book, quantity);
      existing.totalPrice = existing.unitPrice * quantity;
      copy[idx] = existing;
      return copy;
    });
  }

  clearCart(): void {
    this._items.set([]);
  }

  calculateTotals(): { totalBooks: number; totalAmount: number } {
    const items = this._items();
    const totalBooks = items.reduce((acc, it) => acc + it.quantity, 0);
    const totalAmount = this.pricingService.calculateCartTotal(items, (id: string) => this.booksService.getBookById(id));
    return { totalBooks, totalAmount };
  }
}
