import { OrderItem } from '../models/order-item.model';
import { Address } from '../models/address.model';
import { Customer } from '../models/customer.model';

export interface OrderRequestDto {
  customer: Pick<Customer, 'id' | 'firstName' | 'lastName' | 'email' | 'phone'>;
  items: Array<Pick<OrderItem, 'bookId' | 'quantity' | 'unitPrice' | 'currency'>>;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string;
  currency: string;
  notes?: string;
}
