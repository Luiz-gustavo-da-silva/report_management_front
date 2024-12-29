export interface Product {
  id?: number;
  name: string;
  price: number;
  category: string;
  description: string;
  createdAt?: string;
}

export interface ProductRedu{
  id: number;
  name: string;
}