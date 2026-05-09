import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WatchlistItem, ApiResponse } from '../models/portfolio.model';

@Injectable({ providedIn: 'root' })
export class WatchlistService {
  private readonly apiUrl = `${environment.apiUrl}/api/watchlist`;

  constructor(private http: HttpClient) {}

  getWatchlist(): Observable<WatchlistItem[]> {
    return this.http.get<ApiResponse<WatchlistItem[]>>(this.apiUrl)
      .pipe(map(res => res.data || []));
  }

  addToWatchlist(cryptoId: string, symbol: string, name: string): Observable<ApiResponse<WatchlistItem>> {
    return this.http.post<ApiResponse<WatchlistItem>>(this.apiUrl, {
      crypto_id: cryptoId, crypto_symbol: symbol, crypto_name: name
    });
  }

  removeFromWatchlist(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
