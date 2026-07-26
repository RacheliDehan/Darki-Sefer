export interface OrderQuoteRequestDto {
  customerId: string;
  bookIds: string[];
  quantities: number[];
  currency: string;
  requestedAt: string;
  notes?: string;
  
  customerName: string;

  institutionName: string;

  bookName: string;

  quantity: number;

  delivery: boolean;

  phone: string;

  email: string;
}


