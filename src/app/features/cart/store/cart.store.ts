import { Injectable, computed, Signal } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { PricingService } from '../../../services/pricing.service';
import { BooksService } from '../../../services/books.service';
import { CartItem } from '../../../models/cart-item.model';

@Injectable({ providedIn: 'root' })
export class CartStore {
  public readonly items: Signal<CartItem[]>;

  public readonly totalBooks = computed(() => this.items().reduce((acc, it) => acc + it.quantity, 0));

  public readonly totalAmount = computed(() =>
    this.pricingService.calculateCartTotal(this.items(), (id: string) => this.booksService.getBookById(id))
  );

  constructor(
    private cartService: CartService,
    private pricingService: PricingService,
    private booksService: BooksService
  ) {
    this.items = this.cartService.items;
  }

  addItem(bookId: string, quantity: number): void {
    this.cartService.addItem(bookId, quantity);
  }

  removeItem(bookId: string): void {
    this.cartService.removeItem(bookId);
  }

  updateQuantity(bookId: string, quantity: number): void {
    this.cartService.updateQuantity(bookId, quantity);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
