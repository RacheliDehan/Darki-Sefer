import { Injectable, signal, computed } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';
import { Customer } from '../../../models/customer.model';
import { CartItem } from '../../../models/cart-item.model';

@Injectable({ providedIn: 'root' })
export class CheckoutStore {
  public readonly customer = signal<Customer | null>(null);

  constructor(private cartService: CartService, private orderService: OrderService) {}

  public readonly orderSummary = computed(() => {
    const items: CartItem[] = this.cartService.items();
    const totals = this.cartService.calculateTotals();
    return {
      items,
      totals
    };
  });

  submitOrder(paymentMethod: string): Promise<unknown> {
    const cust = this.customer();
    if (!cust) {
      return Promise.reject(new Error('Customer not set'));
    }
    const items = this.cartService.items();
    const order = this.orderService.createOrderSummary(cust, items, items[0]?.currency ?? 'ILS');
    const dto = this.orderService.prepareRequestDto(order, paymentMethod);
    return this.orderService.submitOrder(dto);
  }
}
