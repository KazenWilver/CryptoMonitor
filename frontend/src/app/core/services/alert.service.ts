import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PriceAlert, ApiResponse } from '../models/portfolio.model';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly apiUrl = `${environment.apiUrl}/api/alerts`;

  constructor(private http: HttpClient) {}

  getAlerts(): Observable<PriceAlert[]> {
    return this.http.get<ApiResponse<PriceAlert[]>>(this.apiUrl)
      .pipe(map(res => res.data || []));
  }

  createAlert(data: Partial<PriceAlert>): Observable<ApiResponse<PriceAlert>> {
    return this.http.post<ApiResponse<PriceAlert>>(this.apiUrl, data);
  }

  updateAlert(id: number, data: Partial<PriceAlert>): Observable<ApiResponse<PriceAlert>> {
    return this.http.put<ApiResponse<PriceAlert>>(`${this.apiUrl}/${id}`, data);
  }

  deleteAlert(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
