import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-reports',
  standalone: false,
  template: `
    <div class="page-header">
      <h3 class="page-title">{{ 'reports.title' | translate }}</h3>
    </div>

    <div class="reports-grid">
      <div class="card report-card card-hover-glow animate-fadeIn">
        <div class="report-icon">◆</div>
        <h5>{{ 'reports.portfolioReport' | translate }}</h5>
        <p class="text-muted">Exportar holdings e P&L do portfólio</p>
        <div class="flex gap-8 mt-16 justify-center">
          <button class="btn btn-primary btn-sm" (click)="exportReport('portfolio', 'csv')">{{ 'reports.exportCSV' | translate }}</button>
          <button class="btn btn-secondary btn-sm" (click)="exportReport('portfolio', 'pdf')">{{ 'reports.exportPDF' | translate }}</button>
        </div>
      </div>

      <div class="card report-card card-hover-glow animate-fadeIn" style="animation-delay:0.1s">
        <div class="report-icon">★</div>
        <h5>{{ 'reports.watchlistReport' | translate }}</h5>
        <p class="text-muted">Exportar lista de favoritos</p>
        <div class="flex gap-8 mt-16 justify-center">
          <button class="btn btn-primary btn-sm" (click)="exportReport('watchlist', 'csv')">{{ 'reports.exportCSV' | translate }}</button>
          <button class="btn btn-secondary btn-sm" (click)="exportReport('watchlist', 'pdf')">{{ 'reports.exportPDF' | translate }}</button>
        </div>
      </div>

      <div class="card report-card card-hover-glow animate-fadeIn" style="animation-delay:0.2s">
        <div class="report-icon">▤</div>
        <h5>{{ 'reports.transactionsReport' | translate }}</h5>
        <p class="text-muted">Exportar histórico de transações</p>
        <div class="flex gap-8 mt-16 justify-center">
          <button class="btn btn-primary btn-sm" (click)="exportReport('transactions', 'csv')">{{ 'reports.exportCSV' | translate }}</button>
          <button class="btn btn-secondary btn-sm" (click)="exportReport('transactions', 'pdf')">{{ 'reports.exportPDF' | translate }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
    .report-card { text-align: center; padding: 24px; }
    .report-icon { font-size: 32px; margin-bottom: 12px; color: var(--color-primary); }
  `]
})
export class ReportsComponent {
  private apiUrl = environment.apiUrl;

  constructor(private toast: ToastService) {}

  exportReport(type: string, format: string): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.toast.error('Sessão expirada. Por favor, faça login novamente.');
      return;
    }
    const url = format === 'pdf'
      ? `${this.apiUrl}/api/export/${type}?format=pdf&token=${token}`
      : `${this.apiUrl}/api/export/${type}?token=${token}`;
    this.toast.info(`A exportar ${type} em ${format.toUpperCase()}...`);
    window.open(url, '_blank');
  }
}
