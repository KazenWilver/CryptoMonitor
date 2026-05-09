import { Component, OnInit } from '@angular/core';
import { WatchlistService } from '../../core/services/watchlist.service';
import { ToastService } from '../../core/services/toast.service';
import { WatchlistItem } from '../../core/models/portfolio.model';

@Component({
  selector: 'app-watchlist',
  standalone: false,
  template: `
    <div class="page-header">
      <h3 class="page-title">{{ 'nav.watchlist' | translate }}</h3>
    </div>

    <div class="card animate-fadeIn" *ngIf="items.length > 0">
      <table>
        <thead>
          <tr>
            <th>{{ 'portfolio.holdings' | translate }}</th>
            <th>{{ 'crypto.rank' | translate }}</th>
            <th>ID</th>
            <th>{{ 'portfolio.date' | translate }}</th>
            <th>{{ 'common.actions' | translate }}</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of items" class="table-row-interactive">
            <td style="font-weight:500">{{ item.crypto_name }}</td>
            <td class="mono">{{ item.crypto_symbol | uppercase }}</td>
            <td class="metadata">{{ item.crypto_id }}</td>
            <td class="metadata">{{ item.added_at | date:'dd/MM/yyyy' }}</td>
            <td>
              <button class="btn btn-sm btn-danger" (click)="remove(item)">
                {{ 'common.delete' | translate }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="empty-state animate-fadeIn" *ngIf="!loading && items.length === 0">
      <span style="font-size:48px">★</span>
      <p>{{ 'common.noData' | translate }}</p>
      <a routerLink="/market" class="btn btn-primary">{{ 'nav.market' | translate }}</a>
    </div>

    <div class="empty-state" *ngIf="loading"><div class="spinner"></div></div>
  `
})
export class WatchlistComponent implements OnInit {
  items: WatchlistItem[] = [];
  loading = true;

  constructor(private watchlistService: WatchlistService, private toast: ToastService) {}

  ngOnInit(): void {
    this.watchlistService.getWatchlist().subscribe({
      next: (data) => { this.items = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  remove(item: WatchlistItem): void {
    this.watchlistService.removeFromWatchlist(item.id).subscribe({
      next: () => {
        this.items = this.items.filter(i => i.id !== item.id);
        this.toast.success(`${item.crypto_name} removido dos favoritos`);
      },
      error: () => this.toast.error('Erro ao remover dos favoritos')
    });
  }
}
