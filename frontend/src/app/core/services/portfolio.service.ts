import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PortfolioSummary, PortfolioTransaction, ApiResponse } from '../models/portfolio.model';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly apiUrl = `${environment.apiUrl}/api/portfolio`;

  constructor(private http: HttpClient) {}

  getHoldings(): Observable<PortfolioSummary> {
    return this.http.get<ApiResponse<PortfolioSummary>>(this.apiUrl)
      .pipe(map(res => res.data!));
  }

  getTransactions(): Observable<PortfolioTransaction[]> {
    return this.http.get<ApiResponse<PortfolioTransaction[]>>(`${this.apiUrl}/transactions`)
      .pipe(map(res => res.data || []));
  }

  addTransaction(data: Partial<PortfolioTransaction>): Observable<ApiResponse<PortfolioTransaction>> {
    return this.http.post<ApiResponse<PortfolioTransaction>>(`${this.apiUrl}/transactions`, data);
  }

  updateTransaction(id: number, data: Partial<PortfolioTransaction>): Observable<ApiResponse<PortfolioTransaction>> {
    return this.http.put<ApiResponse<PortfolioTransaction>>(`${this.apiUrl}/transactions/${id}`, data);
  }

  deleteTransaction(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/transactions/${id}`);
  }
}
