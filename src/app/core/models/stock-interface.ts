import { Product } from './product-interface';

export interface StockObj {
  count: number;
  data: StockData[];
}

export interface StockData {
  id: number;
  productId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

export interface Stock {
  productId: number;
  quantity: number;
}
