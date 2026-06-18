import { Book } from './book.model';

export interface CartItem {
  bookId: string;
  book?: Book;
  quantity: number;
  unitPrice: number;
  currency: string;
  totalPrice: number;
  addedAt: string; // ISO date string
}
