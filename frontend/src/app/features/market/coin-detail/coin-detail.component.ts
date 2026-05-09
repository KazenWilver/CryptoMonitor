import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CryptoService } from '../../../core/services/crypto.service';
import { WatchlistService } from '../../../core/services/watchlist.service';

@Component({
  selector: 'app-coin-detail',
  template: `
    <div *ngIf="coin">
      <div class="page-header">
        <div class="flex items-center gap-12">
          <img [src]="coin.image?.large" [alt]="coin.name" style="width:40px;height:40px;border-radius:50%" />
          <div>
            <h3 class="page-title">{{ coin.name }}</h3>
            <span class="metadata">{{ coin.symbol | uppercase }}</span>
          </div>
        </div>
        <button class="btn btn-primary" (click)="addToWatchlist()">
          {{ 'crypto.addToWatchlist' | translate }}
        </button>
      </div>

      <!-- Price & Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">{{ 'crypto.price' | translate }}</div>
          <div class="stat-value">\${{ coin.market_data?.current_price?.usd | number:'1.2-6' }}</div>
          <div class="stat-change" [ngClass]="coin.market_data?.price_change_percentage_24h > 0 ? 'text-success' : 'text-error'">
            {{ coin.market_data?.price_change_percentage_24h | number:'1.2-2' }}% (24h)
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ 'crypto.marketCap' | translate }}</div>
          <div class="stat-value mono">\${{ formatNum(coin.market_data?.market_cap?.usd) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ 'crypto.volume' | translate }}</div>
          <div class="stat-value mono">\${{ formatNum(coin.market_data?.total_volume?.usd) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ 'crypto.supply' | translate }}</div>
          <div class="stat-value mono">{{ coin.market_data?.circulating_supply | number:'1.0-0' }}</div>
        </div>
      </div>

      <!-- Period Selector + Chart Placeholder -->
      <div class="card mt-24">
        <div class="flex items-center gap-8 mb-16">
          <button *ngFor="let p of periods" class="btn btn-sm"
                  [class.btn-primary]="selectedPeriod === p.days"
                  [class.btn-ghost]="selectedPeriod !== p.days"
                  (click)="loadHistory(p.days)">
            {{ p.label }}
          </button>
        </div>
        <div class="chart-placeholder" style="height:300px;display:flex;align-items:center;justify-content:center;border:1px dashed var(--border);border-radius:8px">
          <canvas id="priceChart" style="width:100%;height:100%"></canvas>
        </div>
      </div>

      <!-- Analytics -->
      <div class="card mt-24" *ngIf="analytics">
        <h5 class="mb-16">{{ 'crypto.analytics' | translate }}</h5>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">{{ 'crypto.ma7' | translate }}</div>
            <div class="stat-value mono">\${{ analytics.ma7 | number:'1.2-2' }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">{{ 'crypto.ma30' | translate }}</div>
            <div class="stat-value mono">\${{ analytics.ma30 | number:'1.2-2' }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">{{ 'crypto.volatility' | translate }} 7D</div>
            <div class="stat-value mono">{{ analytics.volatility_7d }}%</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">{{ 'crypto.trend' | translate }}</div>
            <div class="stat-value">
              <span class="chip" [ngClass]="{
                'chip-positive': analytics.trend === 'bullish',
                'chip-negative': analytics.trend === 'bearish',
                'chip-neutral': analytics.trend === 'neutral'
              }">
                {{ analytics.trend === 'bullish' ? ('crypto.bullish' | translate) :
                   analytics.trend === 'bearish' ? ('crypto.bearish' | translate) :
                   ('crypto.neutral' | translate) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Stats -->
      <div class="card mt-24">
        <h5 class="mb-16">Estatísticas Adicionais</h5>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">{{ 'crypto.ath' | translate }}</div>
            <div class="stat-value mono">\${{ coin.market_data?.ath?.usd | number:'1.2-6' }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">{{ 'crypto.atl' | translate }}</div>
            <div class="stat-value mono">\${{ coin.market_data?.atl?.usd | number:'1.2-6' }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">{{ 'crypto.change7d' | translate }}</div>
            <div class="stat-value">
              <span class="chip" [ngClass]="coin.market_data?.price_change_percentage_7d > 0 ? 'chip-positive':'chip-negative'">
                {{ coin.market_data?.price_change_percentage_7d | number:'1.2-2' }}%
              </span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-label">30D</div>
            <div class="stat-value">
              <span class="chip" [ngClass]="coin.market_data?.price_change_percentage_30d > 0 ? 'chip-positive':'chip-negative'">
                {{ coin.market_data?.price_change_percentage_30d | number:'1.2-2' }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="empty-state" *ngIf="loading">
      <div class="spinner"></div>
    </div>
  `
})
export class CoinDetailComponent implements OnInit {
  coin: any = null;
  analytics: any = null;
  loading = true;
  selectedPeriod = 7;
  periods = [
    { label: '1D', days: 1 }, { label: '7D', days: 7 },
    { label: '30D', days: 30 }, { label: '1Y', days: 365 }
  ];

  constructor(
    private route: ActivatedRoute,
    private crypto: CryptoService,
    private watchlist: WatchlistService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.crypto.getCoinDetail(id).subscribe({
      next: (data) => { this.coin = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
    this.crypto.getAnalytics(id).subscribe({ next: (data) => { this.analytics = data; }});
    this.loadHistory(7);
  }

  loadHistory(days: number): void {
    this.selectedPeriod = days;
    const id = this.route.snapshot.paramMap.get('id')!;
    this.crypto.getCoinHistory(id, days).subscribe();
  }

  addToWatchlist(): void {
    if (!this.coin) return;
    this.watchlist.addToWatchlist(this.coin.id, this.coin.symbol, this.coin.name).subscribe();
  }

  formatNum(n: number): string {
    if (!n) return '0';
    if (n >= 1e12) return (n/1e12).toFixed(2)+'T';
    if (n >= 1e9) return (n/1e9).toFixed(2)+'B';
    if (n >= 1e6) return (n/1e6).toFixed(2)+'M';
    return n.toFixed(2);
  }
}
