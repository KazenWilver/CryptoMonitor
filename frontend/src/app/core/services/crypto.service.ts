import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CryptoCoin, CoinDetail, MarketChart, GlobalData, Analytics } from '../models/crypto.model';
import { ApiResponse } from '../models/portfolio.model';

@Injectable({ providedIn: 'root' })
export class CryptoService {
  private readonly apiUrl = `${environment.apiUrl}/api/crypto`;

  constructor(private http: HttpClient) {}

  getMarkets(page = 1, perPage = 50, currency = 'usd'): Observable<CryptoCoin[]> {
    const params = new HttpParams()
      .set('page', page).set('per_page', perPage).set('currency', currency);
    return this.http.get<ApiResponse<CryptoCoin[]>>(`${this.apiUrl}/markets`, { params })
      .pipe(map(res => res.data || []));
  }

  getTrending(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/trending`)
      .pipe(map(res => res.data));
  }

  getGlobal(): Observable<GlobalData> {
    return this.http.get<ApiResponse<GlobalData>>(`${this.apiUrl}/global`)
      .pipe(map(res => res.data!));
  }

  getCoinDetail(id: string): Observable<CoinDetail> {
    return this.http.get<ApiResponse<CoinDetail>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data!));
  }

  getCoinHistory(id: string, days = 7, currency = 'usd'): Observable<MarketChart> {
    const params = new HttpParams().set('days', days).set('currency', currency);
    return this.http.get<ApiResponse<MarketChart>>(`${this.apiUrl}/${id}/history`, { params })
      .pipe(map(res => res.data!));
  }

  getAnalytics(id: string): Observable<Analytics> {
    return this.http.get<ApiResponse<Analytics>>(`${this.apiUrl}/${id}/analytics`)
      .pipe(map(res => res.data!));
  }

  search(query: string): Observable<any> {
    const params = new HttpParams().set('q', query);
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/search`, { params })
      .pipe(map(res => res.data));
  }
}
