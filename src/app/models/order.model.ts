import { OrderItem } from './order-item.model';
import { Customer } from './customer.model';
import { OrderStatus } from './order-status.enum';
import { Address } from './address.model';

export interface Order {
  id: string;
  customerId: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  shippingAddress?: Address;
  billingAddress?: Address;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
  notes?: string;
}
