import { Injectable } from '@angular/core';
import { OrderQuoteRequestDto } from '../dto/order-quote-request.dto';

@Injectable({ providedIn: 'root' })
export class QuoteRequestService {
  async requestQuote(request: OrderQuoteRequestDto): Promise<void> {
    // Placeholder for future API integration
    console.log('Quote request submitted', request);
    return Promise.resolve();
  }
}
