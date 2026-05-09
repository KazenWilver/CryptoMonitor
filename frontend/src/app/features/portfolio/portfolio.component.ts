import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../core/services/portfolio.service';
import { PortfolioSummary, PortfolioTransaction } from '../../core/models/portfolio.model';

@Component({
  selector: 'app-portfolio',
  standalone: false,
  template: `
    <div class="page-header">
      <h3 class="page-title">{{ 'portfolio.title' | translate }}</h3>
      <button class="btn btn-primary" (click)="showModal = true">
        + {{ 'portfolio.addTransaction' | translate }}
      </button>
    </div>

    <!-- Summary Stats -->
    <div class="stats-grid" *ngIf="summary">
      <div class="stat-card">
        <div class="stat-label">{{ 'portfolio.totalValue' | translate }}</div>
        <div class="stat-value">\${{ summary.total_value | number:'1.2-2' }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">{{ 'portfolio.totalCost' | translate }}</div>
        <div class="stat-value">\${{ summary.total_cost | number:'1.2-2' }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">{{ 'portfolio.pnl' | translate }}</div>
        <div class="stat-value" [class.text-success]="summary.total_pnl > 0" [class.text-error]="summary.total_pnl < 0">
          \${{ summary.total_pnl | number:'1.2-2' }}
        </div>
        <div class="stat-change" [class.text-success]="summary.total_pnl_percent > 0" [class.text-error]="summary.total_pnl_percent < 0">
          {{ summary.total_pnl_percent | number:'1.2-2' }}%
        </div>
      </div>
    </div>

    <!-- Holdings -->
    <div class="card mt-24" *ngIf="summary?.holdings?.length">
      <h5 class="mb-16">{{ 'portfolio.holdings' | translate }}</h5>
      <table>
        <thead>
          <tr>
            <th>Moeda</th><th>Qtd</th><th>Preço Atual</th><th>Valor</th><th>P&L</th><th>P&L %</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let h of summary?.holdings">
            <td style="font-weight:500">{{ h.crypto_name }} <span class="metadata">({{ h.crypto_symbol }})</span></td>
            <td class="mono">{{ h.quantity | number:'1.4-8' }}</td>
            <td class="mono">\${{ h.current_price | number:'1.2-6' }}</td>
            <td class="mono">\${{ h.current_value | number:'1.2-2' }}</td>
            <td><span [class.text-success]="h.pnl > 0" [class.text-error]="h.pnl < 0" class="mono">\${{ h.pnl | number:'1.2-2' }}</span></td>
            <td><span class="chip" [ngClass]="h.pnl_percent > 0 ? 'chip-positive' : 'chip-negative'">{{ h.pnl_percent | number:'1.2-2' }}%</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Transactions -->
    <div class="card mt-24" *ngIf="transactions.length">
      <h5 class="mb-16">{{ 'portfolio.transactions' | translate }}</h5>
      <table>
        <thead><tr><th>Data</th><th>Moeda</th><th>Tipo</th><th>Qtd</th><th>Preço</th><th>Total</th><th></th></tr></thead>
        <tbody>
          <tr *ngFor="let tx of transactions">
            <td class="metadata">{{ tx.transaction_date | date:'dd/MM/yyyy' }}</td>
            <td style="font-weight:500">{{ tx.crypto_name }}</td>
            <td><span class="chip" [ngClass]="tx.type === 'buy' ? 'chip-positive' : 'chip-negative'">{{ tx.type | uppercase }}</span></td>
            <td class="mono">{{ tx.quantity }}</td>
            <td class="mono">\${{ tx.price_usd | number:'1.2-6' }}</td>
            <td class="mono">\${{ tx.quantity * tx.price_usd | number:'1.2-2' }}</td>
            <td><button class="btn btn-sm btn-ghost" (click)="deleteTx(tx.id)">✕</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="empty-state" *ngIf="!loading && !summary?.holdings?.length && !transactions.length">
      <span style="font-size:48px">◆</span>
      <p>Sem transações registadas</p>
      <button class="btn btn-primary" (click)="showModal = true">{{ 'portfolio.addTransaction' | translate }}</button>
    </div>

    <!-- Add Transaction Modal -->
    <div class="modal-backdrop" *ngIf="showModal" (click)="showModal = false">
      <div class="modal animate-fadeIn" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h5>{{ 'portfolio.addTransaction' | translate }}</h5>
          <button class="btn btn-icon btn-ghost" (click)="showModal = false">✕</button>
        </div>
        <div class="form-group">
          <label>Crypto ID</label>
          <input type="text" [(ngModel)]="newTx.crypto_id" placeholder="Ex: bitcoin, ethereum, solana" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ 'portfolio.holdings' | translate }}</label>
            <input type="text" [(ngModel)]="newTx.crypto_symbol" placeholder="Ex: BTC" />
          </div>
          <div class="form-group">
            <label>{{ 'auth.name' | translate }}</label>
            <input type="text" [(ngModel)]="newTx.crypto_name" placeholder="Ex: Bitcoin" />
          </div>
        </div>
        <div class="form-group">
          <label>{{ 'portfolio.buy' | translate }} / {{ 'portfolio.sell' | translate }}</label>
          <select [(ngModel)]="newTx.type">
            <option value="buy">🟢 {{ 'portfolio.buy' | translate }}</option>
            <option value="sell">🔴 {{ 'portfolio.sell' | translate }}</option>
          </select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ 'portfolio.quantity' | translate }}</label>
            <input type="number" [(ngModel)]="newTx.quantity" placeholder="0.00" step="any" />
          </div>
          <div class="form-group">
            <label>{{ 'portfolio.priceUsd' | translate }}</label>
            <input type="number" [(ngModel)]="newTx.price_usd" placeholder="0.00" step="any" />
          </div>
        </div>
        <div class="form-group">
          <label>{{ 'portfolio.date' | translate }}</label>
          <input type="date" [(ngModel)]="newTx.transaction_date" />
        </div>
        <div class="form-group">
          <label>{{ 'portfolio.notes' | translate }}</label>
          <textarea [(ngModel)]="newTx.notes" placeholder="Notas opcionais..." rows="2"></textarea>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" (click)="showModal = false">{{ 'common.cancel' | translate }}</button>
          <button class="btn btn-primary" (click)="addTransaction()">{{ 'common.save' | translate }}</button>
        </div>
      </div>
    </div>

    <div class="empty-state" *ngIf="loading"><div class="spinner"></div></div>
  `
})
export class PortfolioComponent implements OnInit {
  summary: PortfolioSummary | null = null;
  transactions: PortfolioTransaction[] = [];
  loading = true;
  showModal = false;
  newTx: any = { type: 'buy', transaction_date: new Date().toISOString().split('T')[0] };

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.portfolioService.getHoldings().subscribe({
      next: (data) => { this.summary = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
    this.portfolioService.getTransactions().subscribe({
      next: (data) => { this.transactions = data; }
    });
  }

  addTransaction(): void {
    this.portfolioService.addTransaction(this.newTx).subscribe({
      next: () => { this.showModal = false; this.newTx = { type: 'buy', transaction_date: new Date().toISOString().split('T')[0] }; this.loadData(); }
    });
  }

  deleteTx(id: number): void {
    this.portfolioService.deleteTransaction(id).subscribe({
      next: () => { this.loadData(); }
    });
  }
}
