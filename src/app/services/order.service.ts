import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { Customer } from '../models/customer.model';
import { Order } from '../models/order.model';
import { OrderResponseDto } from '../dto/order-response.dto';
import { OrderRequestDto } from '../dto/order-request.dto';
import { OrderStatus } from '../models/order-status.enum';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor() {}

  createOrderSummary(customer: Customer, items: CartItem[], currency: string): Order {
    const subtotal = items.reduce((s, it) => s + it.totalPrice, 0);
    const tax = this.calculateTax(subtotal);
    const shipping = this.estimateShipping(items);
    const totalAmount = subtotal + tax + shipping;
    const now = new Date().toISOString();

    const order: Order = {
      id: this.generateId(),
      customerId: customer.id,
      customer,
      items: items.map(i => ({
        bookId: i.bookId,
        title: i.book?.title ?? '',
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        totalPrice: i.totalPrice,
        currency: i.currency
      })),
      subtotal,
      tax,
      shipping,
      totalAmount,
      currency,
      status: OrderStatus.PENDING,
      createdAt: now
    } as Order;

    return order;
  }

  generateEmailPayload(order: Order): { subject: string; body: string } {
    const subject = `הזמנה חדשה #${order.id}`;
    const lines = [
      `סיכום הזמנה: ${order.id}`,
      `לקוח: ${order.customer?.firstName} ${order.customer?.lastName}`,
      `סה"כ פריטים: ${order.items.length}`,
      `סה"כ לתשלום: ${order.totalAmount} ${order.currency}`,
      '',
      'פריטים:'
    ];
    for (const item of order.items) {
      lines.push(`${item.title} x ${item.quantity} - ${item.totalPrice} ${item.currency}`);
    }
    const body = lines.join('\n');
    return { subject, body };
  }

  prepareRequestDto(order: Order, paymentMethod: string): OrderRequestDto {
    const shippingAddress = order.shippingAddress ?? order.customer?.shippingAddress;
    if (!shippingAddress) {
      throw new Error('Shipping address is required to prepare order request');
    }
    return {
      customer: {
        id: order.customer.id,
        firstName: order.customer.firstName,
        lastName: order.customer.lastName,
        email: order.customer.email,
        phone: order.customer.phone
      },
      items: order.items.map(i => ({ bookId: i.bookId, quantity: i.quantity, unitPrice: i.unitPrice, currency: i.currency })),
      shippingAddress,
      billingAddress: order.billingAddress,
      paymentMethod,
      currency: order.currency,
      notes: order.notes
    } as OrderRequestDto;
  }

  async submitOrder(_dto: OrderRequestDto): Promise<OrderResponseDto> {
    // Prepared for future HTTP integration; currently produce response envelope
    const now = new Date().toISOString();
    const response: OrderResponseDto = {
      orderId: 'pending',
      status: OrderStatus.PENDING,
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      totalAmount: 0,
      currency: _dto.currency,
      createdAt: now
    };
    return Promise.resolve(response);
  }

  private calculateTax(subtotal: number): number {
    const TAX_RATE = 0.17;
    return Math.round(subtotal * TAX_RATE * 100) / 100;
  }

  private estimateShipping(_items: CartItem[]): number {
    return 0;
  }

  private generateId(): string {
    return `order_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }
}
