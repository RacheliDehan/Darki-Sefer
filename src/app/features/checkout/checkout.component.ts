import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutStore } from './store/checkout.store';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  constructor(public readonly store: CheckoutStore) {}

  submit(paymentMethod: string): void {
    void this.store.submitOrder(paymentMethod);
  }
}
