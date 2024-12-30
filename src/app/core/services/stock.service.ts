import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AutenticacaoService, DefaultResponse } from './autenticacao.service';
import { Observable } from 'rxjs';
import { Stock, StockObj, StockProduct } from '../models/stock-interface';
import { FilterStock } from '../models/filter-stock-interface';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  readonly baseUrl = 'http://localhost:3000/api';

  constructor(
    private httpClient: HttpClient,
    private autenticacaoService: AutenticacaoService
  ) {}

  findAll(filter: FilterStock): Observable<StockObj> {
    const token = this.autenticacaoService.usuarioLogado?.token;
    const headers = { Authorization: `${token}` };

    let params = new HttpParams();
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.append(key, String(value));
      }
    });

    return this.httpClient.get<StockObj>(`${this.baseUrl}/stock`, {
      headers,
      params,
    });
  }

  addStock(stock: Stock): Observable<DefaultResponse> {
    const token = this.autenticacaoService.usuarioLogado?.token;
    const headers = { Authorization: `${token}` };

    return this.httpClient.post<DefaultResponse>(
      `${this.baseUrl}/stock`,
      stock,
      { headers }
    );
  }

  updateStock(stock: Stock): Observable<DefaultResponse> {
    const token = this.autenticacaoService.usuarioLogado?.token;
    const headers = { Authorization: `${token}` };

    return this.httpClient.put<DefaultResponse>(
      `${this.baseUrl}/stock/update`,
      stock,
      { headers }
    );
  }

  deleteStock(id: number): Observable<DefaultResponse> {
    const token = this.autenticacaoService.usuarioLogado?.token;
    const headers = { Authorization: `${token}` };

    return this.httpClient.delete<DefaultResponse>(
      `${this.baseUrl}/stock/${id}`,
      { headers }
    );
  }

  getStockById(id: number): Observable<StockProduct> {
    const token = this.autenticacaoService.usuarioLogado?.token;
    const headers = { Authorization: `${token}` };

    return this.httpClient.get<StockProduct>(`${this.baseUrl}/stock/${id}`, {
      headers,
    });
  }
}
