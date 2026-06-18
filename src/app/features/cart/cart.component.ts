import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartStore } from './store/cart.store';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  constructor(public readonly store: CartStore) {}
}
