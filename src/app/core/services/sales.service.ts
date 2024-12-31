import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AutenticacaoService, DefaultResponse } from './autenticacao.service';
import { Observable } from 'rxjs';
import { Sale, SaleObj } from '../models/sale-interface';
import { FilterSale } from '../models/filter-sale-interface';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  readonly baseUrl = 'http://localhost:3000/api';

  constructor(
    private httpClient: HttpClient,
    private autenticacaoService: AutenticacaoService
  ) {}

  findAll(filter: FilterSale): Observable<SaleObj> {
    const token = this.autenticacaoService.usuarioLogado?.token;
    const headers = { Authorization: `${token}` };

    let params = new HttpParams();
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.append(key, String(value));
      }
    });

    return this.httpClient.get<SaleObj>(`${this.baseUrl}/sale`, {
      headers, params
    });
  }

  addSale(sale: Sale): Observable<DefaultResponse> {
    const token = this.autenticacaoService.usuarioLogado?.token;
    const headers = { Authorization: `${token}` };

    return this.httpClient.post<DefaultResponse>(`${this.baseUrl}/sale`, sale, {
      headers,
    });
  }

  deleteSale(id: number): Observable<DefaultResponse> {
    const token = this.autenticacaoService.usuarioLogado?.token;
    const headers = { Authorization: `${token}` };

    return this.httpClient.delete<DefaultResponse>(
      `${this.baseUrl}/sale/${id}`,
      { headers }
    );
  }
}
