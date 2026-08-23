import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartStore } from '../cart/store/cart.store';

interface BookOption {
  id: string;
  title: string;
  grade: string;
  price: number;
  available: boolean;
  quantity: number;
}

@Component({
  selector: 'app-book-order',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './book-order.html',
  styleUrls: ['./book-order.css']
})
export class BookOrderComponent {

  private store = inject(CartStore);
get totalBooks(): number {
  return this.store.totalBooks();
}

get totalAmount(): number {
  return this.store.totalAmount();
}
  readonly bookPrice = 17;

  books: BookOption[] = [
    {
      id: 'nature-a',
      title: 'ספר טבע לכיתה א',
      grade: 'א',
      price: 17,
      available: false,
      quantity: 0
    },
    {
      id: 'nature-b',
      title: 'ספר טבע לכיתה ב',
      grade: 'ב',
      price: 17,
      available: true,
      quantity: 0
    },
    {
      id: 'nature-c',
      title: 'ספר טבע לכיתה ג',
      grade: 'ג',
      price: 17,
      available: true,
      quantity: 0
    },
    {
      id: 'nature-d',
      title: 'ספר טבע לכיתה ד',
      grade: 'ד',
      price: 17,
      available: true,
      quantity: 0
    },
    {
      id: 'nature-e',
      title: 'ספר טבע לכיתה ה',
      grade: 'ה',
      price: 17,
      available: true,
      quantity: 0
    },
    {
      id: 'nature-f',
      title: 'ספר טבע לכיתה ו',
      grade: 'ו',
      price: 17,
      available: true,
      quantity: 0
    },
    {
      id: 'nature-g',
      title: 'ספר טבע לכיתה ז',
      grade: 'ז',
      price: 17,
      available: true,
      quantity: 0
    },
    {
      id: 'nature-h',
      title: 'ספר טבע לכיתה ח',
      grade: 'ח',
      price: 17,
      available: false,
      quantity: 0
    }
  ];

  onQuantityChange(book: BookOption): void {

    if (!book.available) {
      return;
    }

    const quantity = Number(book.quantity) || 0;

    book.quantity = quantity;

    if (quantity === 0) {
      this.store.removeItem(book.id);
      return;
    }

    this.store.addItem(book.id, quantity);
  }

  getRowTotal(book: BookOption): number {
    return book.quantity * book.price;
  }
}