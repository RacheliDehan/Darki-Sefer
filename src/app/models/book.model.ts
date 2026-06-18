import { BulkPrice } from './bulk-price.model';
import { Category } from './category.model';
import { StockStatus } from './stock-status.enum';

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  isbn: string;
  price: number;
  currency: string;
  categories: Category[];
  images: string[];
  publishedDate: string; // ISO date string
  stockStatus: StockStatus;
  bulkPrices?: BulkPrice[];
  rating?: number; // 0-5 scale
  availableQuantity: number;
}
