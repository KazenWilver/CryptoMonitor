import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CryptoService } from '../../../core/services/crypto.service';
import { WatchlistService } from '../../../core/services/watchlist.service';
import { ToastService } from '../../../core/services/toast.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-coin-detail',
  standalone: false,
  template: `
    <div *ngIf="coin" class="animate-fadeIn">
      <div class="page-header">
        <div class="flex items-center gap-12">
          <img [src]="coin.image?.large" [alt]="coin.name" style="width:40px;height:40px;border-radius:50%" />
          <div>
            <h3 class="page-title">{{ coin.name }}</h3>
            <span class="metadata">{{ coin.symbol | uppercase }} · #{{ coin.market_cap_rank }}</span>
          </div>
        </div>
        <button class="btn btn-primary" (click)="addToWatchlist()">
          ★ {{ 'crypto.addToWatchlist' | translate }}
        </button>
      </div>

      <!-- Price & Stats -->
      <div class="stats-grid">
        <div class="stat-card card-hover-glow">
          <div class="stat-label">{{ 'crypto.price' | translate }}</div>
          <div class="stat-value">\${{ coin.market_data?.current_price?.usd | number:'1.2-6' }}</div>
          <div class="stat-change" [ngClass]="coin.market_data?.price_change_percentage_24h > 0 ? 'text-success' : 'text-error'">
            {{ coin.market_data?.price_change_percentage_24h > 0 ? '▲' : '▼' }}
            {{ coin.market_data?.price_change_percentage_24h | number:'1.2-2' }}% (24h)
          </div>
        </div>
        <div class="stat-card card-hover-glow">
          <div class="stat-label">{{ 'crypto.marketCap' | translate }}</div>
          <div class="stat-value mono">\${{ formatNum(coin.market_data?.market_cap?.usd) }}</div>
        </div>
        <div class="stat-card card-hover-glow">
          <div class="stat-label">{{ 'crypto.volume' | translate }}</div>
          <div class="stat-value mono">\${{ formatNum(coin.market_data?.total_volume?.usd) }}</div>
        </div>
        <div class="stat-card card-hover-glow">
          <div class="stat-label">{{ 'crypto.supply' | translate }}</div>
          <div class="stat-value mono">{{ coin.market_data?.circulating_supply | number:'1.0-0' }}</div>
        </div>
      </div>

      <!-- Chart -->
      <div class="card mt-24">
        <div class="flex items-center gap-8 mb-16">
          <button *ngFor="let p of periods" class="btn btn-sm"
                  [class.btn-primary]="selectedPeriod === p.days"
                  [class.btn-ghost]="selectedPeriod !== p.days"
                  (click)="loadHistory(p.days)">
            {{ p.label }}
          </button>
        </div>
        <div style="position:relative;height:300px;">
          <canvas #chartCanvas></canvas>
        </div>
        <div class="empty-state" *ngIf="chartLoading" style="position:absolute;inset:0">
          <div class="spinner"></div>
        </div>
      </div>

      <!-- Analytics -->
      <div class="card mt-24" *ngIf="analytics">
        <h5 class="mb-16">{{ 'crypto.analytics' | translate }}</h5>
        <div class="stats-grid">
          <div class="stat-card card-hover-glow">
            <div class="stat-label">{{ 'crypto.ma7' | translate }}</div>
            <div class="stat-value mono">\${{ analytics.ma7 | number:'1.2-2' }}</div>
          </div>
          <div class="stat-card card-hover-glow">
            <div class="stat-label">{{ 'crypto.ma30' | translate }}</div>
            <div class="stat-value mono">\${{ analytics.ma30 | number:'1.2-2' }}</div>
          </div>
          <div class="stat-card card-hover-glow">
            <div class="stat-label">{{ 'crypto.volatility' | translate }} 7D</div>
            <div class="stat-value mono">{{ analytics.volatility_7d }}%</div>
          </div>
          <div class="stat-card card-hover-glow">
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
        <h5 class="mb-16">{{ 'crypto.additionalStats' | translate }}</h5>
        <div class="stats-grid">
          <div class="stat-card card-hover-glow">
            <div class="stat-label">{{ 'crypto.ath' | translate }}</div>
            <div class="stat-value mono">\${{ coin.market_data?.ath?.usd | number:'1.2-6' }}</div>
          </div>
          <div class="stat-card card-hover-glow">
            <div class="stat-label">{{ 'crypto.atl' | translate }}</div>
            <div class="stat-value mono">\${{ coin.market_data?.atl?.usd | number:'1.2-6' }}</div>
          </div>
          <div class="stat-card card-hover-glow">
            <div class="stat-label">{{ 'crypto.change7d' | translate }}</div>
            <div class="stat-value">
              <span class="chip" [ngClass]="coin.market_data?.price_change_percentage_7d > 0 ? 'chip-positive':'chip-negative'">
                {{ coin.market_data?.price_change_percentage_7d | number:'1.2-2' }}%
              </span>
            </div>
          </div>
          <div class="stat-card card-hover-glow">
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
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  coin: any = null;
  analytics: any = null;
  loading = true;
  chartLoading = false;
  selectedPeriod = 7;
  chart: Chart | null = null;
  periods = [
    { label: '1D', days: 1 }, { label: '7D', days: 7 },
    { label: '30D', days: 30 }, { label: '1Y', days: 365 }
  ];

  constructor(
    private route: ActivatedRoute,
    private crypto: CryptoService,
    private watchlist: WatchlistService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.crypto.getCoinDetail(id).subscribe({
      next: (data) => {
        this.coin = data;
        this.loading = false;
        setTimeout(() => this.loadHistory(7), 100);
      },
      error: () => { this.loading = false; }
    });
    this.crypto.getAnalytics(id).subscribe({ next: (data) => { this.analytics = data; }});
  }

  loadHistory(days: number): void {
    this.selectedPeriod = days;
    this.chartLoading = true;
    const id = this.route.snapshot.paramMap.get('id')!;
    this.crypto.getCoinHistory(id, days).subscribe({
      next: (data: any) => {
        this.chartLoading = false;
        const prices = data?.prices || data?.data?.prices || [];
        if (prices.length > 0) {
          this.renderChart(prices);
        }
      },
      error: () => { this.chartLoading = false; }
    });
  }

  renderChart(prices: number[][]): void {
    if (this.chart) this.chart.destroy();
    if (!this.chartCanvas) return;

    const labels = prices.map((p: number[]) => {
      const d = new Date(p[0]);
      return this.selectedPeriod <= 1
        ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    });
    const values = prices.map((p: number[]) => p[1]);
    const isPositive = values[values.length - 1] >= values[0];

    const ctx = this.chartCanvas.nativeElement.getContext('2d')!;
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, isPositive ? 'rgba(61,214,140,0.25)' : 'rgba(235,87,87,0.25)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: values,
          borderColor: isPositive ? '#3DD68C' : '#EB5757',
          borderWidth: 2,
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: isPositive ? '#3DD68C' : '#EB5757'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(27,27,37,0.95)',
            titleColor: '#F1F1F4',
            bodyColor: '#F1F1F4',
            borderColor: '#2C2C3A',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              label: (ctx: any) => `$${ctx.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(44,44,58,0.5)' },
            ticks: { color: '#8A8F98', maxTicksLimit: 8, font: { size: 10 } }
          },
          y: {
            grid: { color: 'rgba(44,44,58,0.5)' },
            ticks: {
              color: '#8A8F98',
              font: { size: 10, family: 'JetBrains Mono' },
              callback: (v: any) => '$' + Number(v).toLocaleString()
            }
          }
        }
      }
    });
  }

  addToWatchlist(): void {
    if (!this.coin) return;
    this.watchlist.addToWatchlist(this.coin.id, this.coin.symbol, this.coin.name).subscribe({
      next: () => this.toast.success(`${this.coin.name} adicionado aos favoritos!`),
      error: (err) => this.toast.error(err.error?.error || 'Erro ao adicionar aos favoritos')
    });
  }

  formatNum(n: number): string {
    if (!n) return '0';
    if (n >= 1e12) return (n/1e12).toFixed(2)+'T';
    if (n >= 1e9) return (n/1e9).toFixed(2)+'B';
    if (n >= 1e6) return (n/1e6).toFixed(2)+'M';
    return n.toFixed(2);
  }
}
