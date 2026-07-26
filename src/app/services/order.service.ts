import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { Customer } from '../models/customer.model';
import { Order } from '../models/order.model';
import { OrderResponseDto } from '../dto/order-response.dto';
import { OrderRequestDto } from '../dto/order-request.dto';
import { OrderStatus } from '../models/order-status.enum';
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from '../core/constants/email.constants';
import { environment } from '../../environments/environment';
import { OrderQuoteRequestDto } from '../dto/order-quote-request.dto';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private emailJsInitialized = false;

  constructor() {
    this.initializeEmailJs();
  }

  private initializeEmailJs(): void {
    if (!this.emailJsInitialized) {
      emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
      this.emailJsInitialized = true;
    }
  }

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

  async sendOrder(order: Order): Promise<void> {
    try {
      const adminEmailParams = this.buildAdminEmailParams(order);
      const customerEmailParams = this.buildCustomerEmailParams(order);

      // Send admin notification email
      await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.ADMIN_TEMPLATE_ID,
        adminEmailParams
      );

      // Send customer confirmation email
      await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.CUSTOMER_TEMPLATE_ID,
        customerEmailParams
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send order';
      throw new Error(`Order submission failed: ${errorMessage}`);
    }
  }

  private buildAdminEmailParams(order: Order): Record<string, unknown> {
    const itemsList = order.items
      .map(item => `${item.title} × ${item.quantity} - ₪${item.totalPrice}`)
      .join('\n');

    return {
      to_email: EMAIL_CONFIG.ADMIN_EMAIL,
      order_id: order.id,
      order_date: new Date(order.createdAt).toLocaleDateString('he-IL'),
      customer_name: `${order.customer.firstName} ${order.customer.lastName}`,
      institution_name: order.customer.firstName, // Note: institution info could be added to Customer model
      customer_phone: order.customer.phone || '',
      customer_email: order.customer.email,
      items_list: itemsList,
      subtotal: order.subtotal.toFixed(2),
      tax: order.tax.toFixed(2),
      shipping: order.shipping.toFixed(2),
      total_amount: order.totalAmount.toFixed(2),
      currency: order.currency,
      delivery_type: 'משלוח',
      notes: order.notes || 'אין הערות'
    };
  }

  private buildCustomerEmailParams(order: Order): Record<string, unknown> {
    const itemsList = order.items
      .map(item => `${item.title} × ${item.quantity} - ₪${item.totalPrice}`)
      .join('\n');

    return {
      to_email: order.customer.email,
      customer_name: order.customer.firstName,
      order_id: order.id,
      order_date: new Date(order.createdAt).toLocaleDateString('he-IL'),
      items_list: itemsList,
      subtotal: order.subtotal.toFixed(2),
      tax: order.tax.toFixed(2),
      shipping: order.shipping.toFixed(2),
      total_amount: order.totalAmount.toFixed(2),
      currency: order.currency
    };
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

  async sendQuoteRequest(dto: OrderQuoteRequestDto): Promise<void> {

    const templateParams = {

      customer_name: dto.customerName,

      institution_name: dto.institutionName,

      book_name: dto.bookName,

      quantity: dto.quantity,

      delivery: dto.delivery ? 'כן' : 'לא',

      phone: dto.phone,

      email: dto.email,

      to_email: environment.emailJs.adminEmail

    };

    await emailjs.send(

      environment.emailJs.serviceId,

      environment.emailJs.adminTemplateId,

      templateParams,

      environment.emailJs.publicKey

    );

  }

}
