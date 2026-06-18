import { BulkPrice } from '../models/bulk-price.model';
import { StockStatus } from '../models/stock-status.enum';

export interface BookDto {
  id?: string;
  title: string;
  author: string;
  description: string;
  isbn: string;
  price: number;
  currency: string;
  categoryIds: string[];
  images?: string[];
  publishedDate?: string; // ISO date string
  stockStatus?: StockStatus;
  bulkPrices?: BulkPrice[];
  rating?: number;
  availableQuantity?: number;
}
