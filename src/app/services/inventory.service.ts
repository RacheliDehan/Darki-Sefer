import { Injectable } from '@angular/core';
import { Book } from '../models/book.model';
import { StockStatus } from '../models/stock-status.enum';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  constructor() {}

  canOrder(book: Book, quantity: number): boolean {
    const status = this.calculateStockStatus(book);
    if (status === StockStatus.OUT_OF_STOCK) {
      return false;
    }
    if (book.availableQuantity < quantity) {
      return false;
    }
    return true;
  }

  calculateStockStatus(book: Book): StockStatus {
    if (book.availableQuantity <= 0) {
      return StockStatus.OUT_OF_STOCK;
    }
    // future published date means preorder
    const now = new Date();
    const published = new Date(book.publishedDate);
    if (published.getTime() > now.getTime()) {
      return StockStatus.PREORDER;
    }
    if (book.availableQuantity <= 5) {
      return StockStatus.LIMITED;
    }
    return StockStatus.IN_STOCK;
  }
}
