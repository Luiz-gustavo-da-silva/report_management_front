import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AutenticacaoService, DefaultResponse } from './autenticacao.service';
import { Product, ProductRedu } from '../models/product-interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  readonly baseUrl = 'http://localhost:3000/api';

  constructor(
    private httpClient: HttpClient,
    private autenticacaoService: AutenticacaoService
  ) {}

  findAll(): Observable<Product[]> {
    const token = this.autenticacaoService.usuarioLogado?.token;
    const headers = { Authorization: `${token}` };

    return this.httpClient.get<Product[]>(`${this.baseUrl}/product`, { headers });
  }

  addProduct(product: Product): Observable<DefaultResponse> {
    const token = this.autenticacaoService.usuarioLogado?.token;
    const headers = { Authorization: `${token}` };
  
    return this.httpClient.post<DefaultResponse>(`${this.baseUrl}/product`, product, { headers });
  }

  updateProduct(product: Product): Observable<DefaultResponse> {
    const token = this.autenticacaoService.usuarioLogado?.token;
    const headers = { Authorization: `${token}` };
  
    return this.httpClient.put<DefaultResponse>(`${this.baseUrl}/product/update`, product, { headers });
  }

  deleteProduct(id: number): Observable<DefaultResponse> {
    const token = this.autenticacaoService.usuarioLogado?.token;
    const headers = { Authorization: `${token}` };
  
    return this.httpClient.delete<DefaultResponse>(`${this.baseUrl}/product/${id}`, { headers });
  }

  getProductById(id: number): Observable<Product> {
    const token = this.autenticacaoService.usuarioLogado?.token;
    const headers = { Authorization: `${token}` };

    return this.httpClient.get<Product>(`${this.baseUrl}/product/${id}`, { headers });
  }
  
  getlistProductId(): Observable<ProductRedu[]> {
    const token = this.autenticacaoService.usuarioLogado?.token;
    const headers = { Authorization: `${token}` };

    return this.httpClient.get<ProductRedu[]>(`${this.baseUrl}/product/listProductId`, { headers });
  }
}
