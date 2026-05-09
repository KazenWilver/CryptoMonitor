import { Component, OnInit } from '@angular/core';
import { CryptoService } from '../../core/services/crypto.service';
import { CryptoCoin } from '../../core/models/crypto.model';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  template: `
    <div class="page-header">
      <h3 class="page-title">{{ 'dashboard.title' | translate }}</h3>
    </div>

    <!-- Global Stats -->
    <div class="stats-grid" *ngIf="globalData">
      <div class="stat-card">
        <div class="stat-label">{{ 'dashboard.marketCap' | translate }}</div>
        <div class="stat-value">\${{ formatBigNumber(globalData.data?.total_market_cap?.usd) }}</div>
        <div class="stat-change" [class.text-success]="globalData.data?.market_cap_change_percentage_24h_usd > 0"
             [class.text-error]="globalData.data?.market_cap_change_percentage_24h_usd < 0">
          {{ globalData.data?.market_cap_change_percentage_24h_usd | number:'1.2-2' }}%
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-label">{{ 'dashboard.volume24h' | translate }}</div>
        <div class="stat-value">\${{ formatBigNumber(globalData.data?.total_volume?.usd) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">{{ 'dashboard.btcDominance' | translate }}</div>
        <div class="stat-value mono">{{ globalData.data?.market_cap_percentage?.btc | number:'1.1-1' }}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">{{ 'dashboard.activeCryptos' | translate }}</div>
        <div class="stat-value mono">{{ globalData.data?.active_cryptocurrencies | number }}</div>
      </div>
    </div>

    <!-- Trending -->
    <div class="card mt-24" *ngIf="trending">
      <h5 class="mb-16">🔥 {{ 'dashboard.trending' | translate }}</h5>
      <div class="trending-grid">
        <div class="trending-item card-hover" *ngFor="let coin of trending?.coins?.slice(0, 7)">
          <img [src]="coin.item?.small" [alt]="coin.item?.name" class="trending-img" />
          <div class="trending-info">
            <span class="trending-name">{{ coin.item?.name }}</span>
            <span class="metadata">{{ coin.item?.symbol }}</span>
          </div>
          <span class="chip" [ngClass]="{
            'chip-positive': coin.item?.data?.price_change_percentage_24h?.usd > 0,
            'chip-negative': coin.item?.data?.price_change_percentage_24h?.usd < 0,
            'chip-neutral': coin.item?.data?.price_change_percentage_24h?.usd === 0
          }">
            {{ coin.item?.data?.price_change_percentage_24h?.usd | number:'1.2-2' }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Top Coins Table -->
    <div class="card mt-24">
      <h5 class="mb-16">{{ 'dashboard.marketOverview' | translate }}</h5>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>{{ 'crypto.price' | translate }}</th>
              <th>{{ 'crypto.change24h' | translate }}</th>
              <th>{{ 'crypto.change7d' | translate }}</th>
              <th>{{ 'crypto.marketCap' | translate }}</th>
              <th>{{ 'crypto.volume' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let coin of coins?.slice(0, 20)" [routerLink]="['/market', coin.id]" style="cursor:pointer">
              <td>
                <div class="flex items-center gap-8">
                  <span class="text-muted">{{ coin.market_cap_rank }}</span>
                  <img [src]="coin.image" [alt]="coin.name" style="width:24px;height:24px;border-radius:50%" />
                  <div>
                    <div style="font-weight:500">{{ coin.name }}</div>
                    <div class="metadata" style="font-size:11px">{{ coin.symbol | uppercase }}</div>
                  </div>
                </div>
              </td>
              <td class="mono">\${{ coin.current_price | number:'1.2-6' }}</td>
              <td>
                <span class="chip" [ngClass]="{
                  'chip-positive': coin.price_change_percentage_24h > 0,
                  'chip-negative': coin.price_change_percentage_24h < 0,
                  'chip-neutral': !coin.price_change_percentage_24h
                }">
                  {{ coin.price_change_percentage_24h > 0 ? '↑' : '↓' }}
                  {{ coin.price_change_percentage_24h | number:'1.2-2' }}%
                </span>
              </td>
              <td>
                <span class="chip" [ngClass]="{
                  'chip-positive': (coin.price_change_percentage_7d_in_currency || 0) > 0,
                  'chip-negative': (coin.price_change_percentage_7d_in_currency || 0) < 0,
                  'chip-neutral': !coin.price_change_percentage_7d_in_currency
                }">
                  {{ coin.price_change_percentage_7d_in_currency | number:'1.2-2' }}%
                </span>
              </td>
              <td class="mono">\${{ formatBigNumber(coin.market_cap) }}</td>
              <td class="mono">\${{ formatBigNumber(coin.total_volume) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="empty-state" *ngIf="loading">
      <div class="spinner"></div>
      <p>{{ 'common.loading' | translate }}</p>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  coins: CryptoCoin[] = [];
  globalData: any = null;
  trending: any = null;
  loading = true;

  constructor(private cryptoService: CryptoService) {}

  ngOnInit(): void {
    this.cryptoService.getMarkets(1, 50).subscribe({
      next: (data) => { this.coins = data; this.loading = false; },
      error: () => { this.loading = false; }
    });

    this.cryptoService.getGlobal().subscribe({
      next: (data) => { this.globalData = data; }
    });

    this.cryptoService.getTrending().subscribe({
      next: (data) => { this.trending = data; }
    });
  }

  formatBigNumber(num: number): string {
    if (!num) return '0';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  }
}
