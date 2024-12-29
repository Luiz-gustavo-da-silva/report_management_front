import { Product } from './product-interface';

export interface SaleObj {
  count: number;
  data: SaleData[];
}

export interface SaleData {
  id: number,
  productId: number,
  quantity: number,
  totalPrice: number,
  saleDate: string,
  createdAt: string,
  updatedAt: string,
  product: Product
}

export interface Sale {
  productId: number;
  quantity: number;
}
