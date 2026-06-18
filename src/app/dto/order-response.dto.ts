import { OrderItem } from '../models/order-item.model';
import { OrderStatus } from '../models/order-status.enum';

export interface OrderResponseDto {
  orderId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  totalAmount: number;
  currency: string;
  createdAt: string;
  updatedAt?: string;
}
