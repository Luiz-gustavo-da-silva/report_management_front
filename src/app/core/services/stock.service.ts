import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AutenticacaoService, DefaultResponse } from './autenticacao.service';
import { Observable } from 'rxjs';
import { Stock, StockObj } from '../models/stock-interface';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  readonly baseUrl = 'http://localhost:3000/api';

  constructor(
    private httpClient: HttpClient,
    private autenticacaoService: AutenticacaoService
  ) {}

  findAll(): Observable<StockObj> {
    const token = this.autenticacaoService.usuarioLogado?.token;
    const headers = { Authorization: `${token}` };

    return this.httpClient.get<StockObj>(`${this.baseUrl}/stock`, {
      headers,
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
}
