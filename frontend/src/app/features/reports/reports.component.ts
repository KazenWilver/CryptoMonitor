import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
          <button class="btn btn-primary btn-sm" (click)="downloadCSV('portfolio')">{{ 'reports.exportCSV' | translate }}</button>
          <button class="btn btn-secondary btn-sm" (click)="printPDF('portfolio')" [disabled]="printing">{{ 'reports.exportPDF' | translate }}</button>
        </div>
      </div>

      <div class="card report-card card-hover-glow animate-fadeIn" style="animation-delay:0.1s">
        <div class="report-icon">★</div>
        <h5>{{ 'reports.watchlistReport' | translate }}</h5>
        <p class="text-muted">Exportar lista de favoritos</p>
        <div class="flex gap-8 mt-16 justify-center">
          <button class="btn btn-primary btn-sm" (click)="downloadCSV('watchlist')">{{ 'reports.exportCSV' | translate }}</button>
          <button class="btn btn-secondary btn-sm" (click)="printPDF('watchlist')" [disabled]="printing">{{ 'reports.exportPDF' | translate }}</button>
        </div>
      </div>

      <div class="card report-card card-hover-glow animate-fadeIn" style="animation-delay:0.2s">
        <div class="report-icon">▤</div>
        <h5>{{ 'reports.transactionsReport' | translate }}</h5>
        <p class="text-muted">Exportar histórico de transações</p>
        <div class="flex gap-8 mt-16 justify-center">
          <button class="btn btn-primary btn-sm" (click)="downloadCSV('transactions')">{{ 'reports.exportCSV' | translate }}</button>
          <button class="btn btn-secondary btn-sm" (click)="printPDF('transactions')" [disabled]="printing">{{ 'reports.exportPDF' | translate }}</button>
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
  printing = false;

  constructor(private http: HttpClient, private toast: ToastService) {}

  downloadCSV(type: string): void {
    const token = localStorage.getItem('token');
    if (!token) { this.toast.error('Sessão expirada.'); return; }
    this.toast.info(`A exportar ${type} em CSV...`);
    window.open(`${this.apiUrl}/api/export/${type}?token=${token}`, '_blank');
  }

  printPDF(type: string): void {
    const token = localStorage.getItem('token');
    if (!token) { this.toast.error('Sessão expirada.'); return; }

    this.printing = true;
    this.toast.info(`A gerar PDF de ${type}...`);

    this.http.get(`${this.apiUrl}/api/export/${type}?format=pdf&token=${token}`, {
      responseType: 'text'
    }).subscribe({
      next: (html: string) => {
        this.printing = false;
        // Criar iframe oculto, injetar HTML, acionar impressão
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.left = '-9999px';
        iframe.style.top = '-9999px';
        iframe.style.width = '0';
        iframe.style.height = '0';
        document.body.appendChild(iframe);

        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          doc.open();
          doc.write(html);
          doc.close();
          // Esperar que o conteúdo carregue e acionar impressão
          iframe.onload = () => {
            iframe.contentWindow?.print();
            setTimeout(() => document.body.removeChild(iframe), 2000);
          };
          // Fallback se onload não dispara
          setTimeout(() => {
            try { iframe.contentWindow?.print(); } catch(e) {}
            setTimeout(() => {
              try { document.body.removeChild(iframe); } catch(e) {}
            }, 2000);
          }, 500);
        }
      },
      error: () => {
        this.printing = false;
        this.toast.error('Erro ao gerar PDF');
      }
    });
  }
}
