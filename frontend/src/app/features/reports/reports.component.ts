import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reports',
  standalone: false,
  template: `
    <div class="page-header">
      <h3 class="page-title">{{ 'reports.title' | translate }}</h3>
    </div>

    <div class="reports-grid">
      <div class="card report-card">
        <div class="report-icon">◆</div>
        <h5>{{ 'reports.portfolioReport' | translate }}</h5>
        <p class="text-muted">Exportar holdings e P&L do portfólio</p>
        <div class="flex gap-8 mt-16">
          <button class="btn btn-primary btn-sm" (click)="exportCSV('portfolio')">{{ 'reports.exportCSV' | translate }}</button>
          <button class="btn btn-secondary btn-sm" (click)="exportPDF('portfolio')">{{ 'reports.exportPDF' | translate }}</button>
        </div>
      </div>

      <div class="card report-card">
        <div class="report-icon">★</div>
        <h5>{{ 'reports.watchlistReport' | translate }}</h5>
        <p class="text-muted">Exportar lista de favoritos</p>
        <div class="flex gap-8 mt-16">
          <button class="btn btn-primary btn-sm" (click)="exportCSV('watchlist')">{{ 'reports.exportCSV' | translate }}</button>
        </div>
      </div>

      <div class="card report-card">
        <div class="report-icon">▤</div>
        <h5>{{ 'reports.transactionsReport' | translate }}</h5>
        <p class="text-muted">Exportar histórico de transações</p>
        <div class="flex gap-8 mt-16">
          <button class="btn btn-primary btn-sm" (click)="exportCSV('transactions')">{{ 'reports.exportCSV' | translate }}</button>
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

  exportCSV(type: string): void {
    const token = localStorage.getItem('token');
    window.open(`${this.apiUrl}/api/export/${type}?token=${token}`, '_blank');
  }

  exportPDF(type: string): void {
    const token = localStorage.getItem('token');
    window.open(`${this.apiUrl}/api/export/${type}?format=pdf&token=${token}`, '_blank');
  }
}
