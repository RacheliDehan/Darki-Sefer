export interface OrderQuoteRequestDto {
  customerId: string;
  bookIds: string[];
  quantities: number[];
  currency: string;
  requestedAt: string;
  notes?: string;
}
