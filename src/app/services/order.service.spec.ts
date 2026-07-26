import { TestBed } from '@angular/core/testing';
import { OrderService } from './order.service';
import { Order } from '../models/order.model';
import { OrderStatus } from '../models/order-status.enum';
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from '../core/constants/email.constants';

vi.mock('@emailjs/browser', () => ({
  default: {
    init: vi.fn(),
    send: vi.fn()
  }
}));

describe('OrderService - sendOrder', () => {
  let service: OrderService;

  const mockOrder: Order = {
    id: 'ORD_TEST123',
    customerId: 'cust_123',
    customer: {
      id: 'cust_123',
      firstName: 'יוסי',
      lastName: 'כהן',
      email: 'r8175r@gmail.com',
      phone: '0501234567'
    },
    items: [
      {
        bookId: '1',
        title: 'ספר בראשית',
        quantity: 2,
        unitPrice: 45.00,
        totalPrice: 90.00,
        currency: 'ILS'
      }
    ],
    subtotal: 90.00,
    tax: 15.30,
    shipping: 0,
    totalAmount: 105.30,
    currency: 'ILS',
    status: OrderStatus.PENDING,
    createdAt: new Date().toISOString(),
    notes: 'בקשה חשובה'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderService]
    });
    service = TestBed.inject(OrderService);
    vi.clearAllMocks();
  });

  describe('sendOrder', () => {
    it('should initialize EmailJS on first call', async () => {
      (emailjs.send as any).mockResolvedValue({ status: 200 });

      await service.sendOrder(mockOrder);

      expect(emailjs.init).toHaveBeenCalledWith(EMAIL_CONFIG.PUBLIC_KEY);
    });

    it('should send admin email with correct parameters', async () => {
      (emailjs.send as any).mockResolvedValue({ status: 200 });

      await service.sendOrder(mockOrder);

      const firstCallArgs = (emailjs.send as any).mock.calls[0];
      expect(firstCallArgs[0]).toBe(EMAIL_CONFIG.SERVICE_ID);
      expect(firstCallArgs[1]).toBe(EMAIL_CONFIG.ADMIN_TEMPLATE_ID);

      const adminParams = firstCallArgs[2];
      expect(adminParams.to_email).toBe(EMAIL_CONFIG.ADMIN_EMAIL);
      expect(adminParams.order_id).toBe(mockOrder.id);
      expect(adminParams.customer_name).toContain('יוסי');
      expect(adminParams.total_amount).toBe('105.30');
    });

    it('should send customer email with correct parameters', async () => {
      (emailjs.send as any).mockResolvedValue({ status: 200 });

      await service.sendOrder(mockOrder);

      const secondCallArgs = (emailjs.send as any).mock.calls[1];
      expect(secondCallArgs[0]).toBe(EMAIL_CONFIG.SERVICE_ID);
      expect(secondCallArgs[1]).toBe(EMAIL_CONFIG.CUSTOMER_TEMPLATE_ID);

      const customerParams = secondCallArgs[2];
      expect(customerParams.to_email).toBe(mockOrder.customer.email);
      expect(customerParams.customer_name).toBe(mockOrder.customer.firstName);
      expect(customerParams.order_id).toBe(mockOrder.id);
    });

    it('should send both emails in sequence', async () => {
      (emailjs.send as any).mockResolvedValue({ status: 200 });

      await service.sendOrder(mockOrder);

      expect(emailjs.send).toHaveBeenCalledTimes(2);
    });

    it('should throw error if admin email send fails', async () => {
      const error = new Error('Email service error');
      (emailjs.send as any).mockRejectedValueOnce(error);

      await expect(service.sendOrder(mockOrder)).rejects.toThrow('Order submission failed');
    });

    it('should throw error if customer email send fails', async () => {
      (emailjs.send as any).mockResolvedValueOnce({ status: 200 });
      const error = new Error('Customer email failed');
      (emailjs.send as any).mockRejectedValueOnce(error);

      await expect(service.sendOrder(mockOrder)).rejects.toThrow('Order submission failed');
    });

    it('should format order items correctly in email', async () => {
      (emailjs.send as any).mockResolvedValue({ status: 200 });

      const orderWithMultipleItems: Order = {
        ...mockOrder,
        items: [
          {
            bookId: '1',
            title: 'ספר בראשית',
            quantity: 2,
            unitPrice: 45.00,
            totalPrice: 90.00,
            currency: 'ILS'
          },
          {
            bookId: '2',
            title: 'ספר חשבון',
            quantity: 1,
            unitPrice: 55.00,
            totalPrice: 55.00,
            currency: 'ILS'
          }
        ]
      };

      await service.sendOrder(orderWithMultipleItems);

      const adminParams = (emailjs.send as any).mock.calls[0][2];
      expect(adminParams.items_list).toContain('ספר בראשית × 2');
      expect(adminParams.items_list).toContain('ספר חשבון × 1');
    });

    it('should format currency amounts to 2 decimal places', async () => {
      (emailjs.send as any).mockResolvedValue({ status: 200 });

      const orderWithDecimalAmount: Order = {
        ...mockOrder,
        subtotal: 100.567,
        tax: 17.096,
        totalAmount: 117.663
      };

      await service.sendOrder(orderWithDecimalAmount);

      const adminParams = (emailjs.send as any).mock.calls[0][2];
      expect(adminParams.subtotal).toBe('100.57');
      expect(adminParams.tax).toBe('17.10');
      expect(adminParams.total_amount).toBe('117.66');
    });

    it('should handle order with no notes', async () => {
      (emailjs.send as any).mockResolvedValue({ status: 200 });

      const orderWithoutNotes = { ...mockOrder, notes: undefined };

      await service.sendOrder(orderWithoutNotes);

      const adminParams = (emailjs.send as any).mock.calls[0][2];
      expect(adminParams.notes).toBe('אין הערות');
    });
  });
});
