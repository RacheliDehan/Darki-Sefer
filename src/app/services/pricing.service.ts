import { Injectable } from '@angular/core';
import { Book } from '../models/book.model';
import { BulkPrice } from '../models/bulk-price.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({ providedIn: 'root' })
export class PricingService {
  public getUnitPrice(book: Book, quantity: number): number {
    const tiers: BulkPrice[] | undefined = book.bulkPrices;
    if (tiers && tiers.length > 0) {
      const applicable = tiers
        .filter(t => quantity >= t.minQuantity)
        .sort((a, b) => b.minQuantity - a.minQuantity);
      if (applicable.length > 0) {
        return applicable[0].price;
      }
    }
    return book.price;
  }

  public calculateLineTotal(book: Book, quantity: number): number {
    const unit = this.getUnitPrice(book, quantity);
    return unit * quantity;
  }

  public calculateCartTotal(items: CartItem[], booksLookup: (id: string) => Book | undefined): number {
    let total = 0;
    for (const item of items) {
      const book = booksLookup(item.bookId);
      if (!book) {
        continue;
      }
      const unit = this.getUnitPrice(book, item.quantity);
      total += unit * item.quantity;
    }
    return total;
  }
}
