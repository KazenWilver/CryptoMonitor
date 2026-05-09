import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CryptoService } from '../../core/services/crypto.service';
import { CryptoCoin } from '../../core/models/crypto.model';

@Component({
  selector: 'app-market',
  standalone: false,
  template: `
    <div class="page-header">
      <h3 class="page-title">{{ 'nav.market' | translate }}</h3>
      <div class="flex gap-8">
        <input type="text" [(ngModel)]="searchQuery" (input)="onSearch()"
               placeholder="{{ 'common.search' | translate }}..." style="width:250px" />
        <button class="btn btn-secondary" (click)="loadMore()" [disabled]="loading">
          {{ loading ? '...' : 'Mais' }}
        </button>
      </div>
    </div>

    <div class="table-container card">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>{{ 'crypto.price' | translate }}</th>
            <th>1h</th>
            <th>24h</th>
            <th>7d</th>
            <th>{{ 'crypto.marketCap' | translate }}</th>
            <th>{{ 'crypto.volume' | translate }}</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let coin of filteredCoins" [routerLink]="['/market', coin.id]" class="table-row-interactive">
            <td>
              <div class="flex items-center gap-8">
                <span class="text-muted" style="width:24px">{{ coin.market_cap_rank }}</span>
                <img [src]="coin.image" [alt]="coin.name" style="width:24px;height:24px;border-radius:50%" />
                <div>
                  <span style="font-weight:500">{{ coin.name }}</span>
                  <span class="metadata" style="margin-left:6px">{{ coin.symbol | uppercase }}</span>
                </div>
              </div>
            </td>
            <td class="mono">\${{ coin.current_price | number:'1.2-6' }}</td>
            <td>
              <span class="chip" [ngClass]="getChangeClass(coin.price_change_percentage_1h_in_currency)">
                {{ coin.price_change_percentage_1h_in_currency | number:'1.2-2' }}%
              </span>
            </td>
            <td>
              <span class="chip" [ngClass]="getChangeClass(coin.price_change_percentage_24h)">
                {{ coin.price_change_percentage_24h | number:'1.2-2' }}%
              </span>
            </td>
            <td>
              <span class="chip" [ngClass]="getChangeClass(coin.price_change_percentage_7d_in_currency)">
                {{ coin.price_change_percentage_7d_in_currency | number:'1.2-2' }}%
              </span>
            </td>
            <td class="mono">\${{ formatNum(coin.market_cap) }}</td>
            <td class="mono">\${{ formatNum(coin.total_volume) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="empty-state" *ngIf="!loading && filteredCoins.length === 0">
      <span style="font-size:48px">🔍</span>
      <p>{{ 'common.noData' | translate }}</p>
    </div>
  `,
  styles: [`
    :host { display: block; }
    input[type="text"] { height: 32px; }
  `]
})
export class MarketComponent implements OnInit {
  coins: CryptoCoin[] = [];
  filteredCoins: CryptoCoin[] = [];
  searchQuery = '';
  loading = false;
  page = 1;

  constructor(private crypto: CryptoService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadCoins();
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchQuery = params['q'];
        this.onSearch();
      }
    });
  }

  loadCoins(): void {
    this.loading = true;
    this.crypto.getMarkets(this.page, 100).subscribe({
      next: (data) => {
        this.coins = data;
        this.filteredCoins = data;
        this.loading = false;
        if (this.searchQuery) this.onSearch();
      },
      error: () => { this.loading = false; }
    });
  }

  loadMore(): void { this.page++; this.loadCoins(); }

  onSearch(): void {
    const q = this.searchQuery.toLowerCase();
    this.filteredCoins = this.coins.filter(c =>
      c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
    );
  }

  getChangeClass(val: number | undefined): string {
    if (!val) return 'chip-neutral';
    return val > 0 ? 'chip-positive' : 'chip-negative';
  }

  formatNum(n: number): string {
    if (!n) return '0';
    if (n >= 1e12) return (n/1e12).toFixed(2)+'T';
    if (n >= 1e9) return (n/1e9).toFixed(2)+'B';
    if (n >= 1e6) return (n/1e6).toFixed(2)+'M';
    return n.toFixed(0);
  }
}
