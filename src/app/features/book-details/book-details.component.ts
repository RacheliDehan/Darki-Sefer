import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BookDetailsStore } from './store/book-details.store';
import { CartService } from '../../services/cart.service';
import { ToastComponent } from '../../shared/toast/toast'
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastComponent],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent {
  constructor(
    private route: ActivatedRoute,
    public readonly store: BookDetailsStore,
    private cartService: CartService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      void this.store.loadBook(id);
    }
  }
@ViewChild(ToastComponent)
toast!: ToastComponent;
  addToCart(bookId: string, qty: number): void {
    try {
      this.cartService.addItem(bookId, qty);
        this.toast.show('המוצר נוסף בהצלחה');
    } catch (e) {
      // keep simple: console for now
      // real app should show user-facing error
      // eslint-disable-next-line no-console
      console.error('Failed to add to cart', e);
    }
  }
}
