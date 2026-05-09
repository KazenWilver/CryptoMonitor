import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../core/services/alert.service';
import { PriceAlert } from '../../core/models/portfolio.model';

@Component({
  selector: 'app-alerts',
  standalone: false,
  template: `
    <div class="page-header">
      <h3 class="page-title">{{ 'alerts.title' | translate }}</h3>
      <button class="btn btn-primary" (click)="showModal = true">+ {{ 'alerts.createAlert' | translate }}</button>
    </div>

    <div class="card" *ngIf="alerts.length > 0">
      <table>
        <thead><tr><th>Moeda</th><th>Condição</th><th>Preço Alvo</th><th>Estado</th><th>Data</th><th></th></tr></thead>
        <tbody>
          <tr *ngFor="let a of alerts">
            <td class="mono" style="font-weight:500">{{ a.crypto_symbol | uppercase }}</td>
            <td><span class="chip" [ngClass]="a.condition_type === 'above' ? 'chip-positive' : 'chip-negative'">
              {{ a.condition_type === 'above' ? ('alerts.above' | translate) : ('alerts.below' | translate) }}
            </span></td>
            <td class="mono">\${{ a.target_price | number:'1.2-6' }}</td>
            <td>
              <span class="chip" [ngClass]="a.is_active ? 'chip-positive' : 'chip-neutral'">
                {{ a.is_active ? ('alerts.active' | translate) : ('alerts.triggered' | translate) }}
              </span>
            </td>
            <td class="metadata">{{ a.created_at | date:'dd/MM/yyyy' }}</td>
            <td><button class="btn btn-sm btn-ghost" (click)="deleteAlert(a.id)">✕</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="empty-state" *ngIf="!loading && alerts.length === 0">
      <span style="font-size:48px">⚡</span>
      <p>{{ 'alerts.noAlerts' | translate }}</p>
      <button class="btn btn-primary" (click)="showModal = true">{{ 'alerts.createAlert' | translate }}</button>
    </div>

    <!-- Create Alert Modal -->
    <div class="modal-backdrop" *ngIf="showModal" (click)="showModal = false">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h5>{{ 'alerts.createAlert' | translate }}</h5>
          <button class="btn btn-icon btn-ghost" (click)="showModal = false">✕</button>
        </div>
        <div class="form-group"><label>Crypto ID</label><input [(ngModel)]="newAlert.crypto_id" placeholder="bitcoin" /></div>
        <div class="form-group"><label>Símbolo</label><input [(ngModel)]="newAlert.crypto_symbol" placeholder="BTC" /></div>
        <div class="form-group">
          <label>Condição</label>
          <select [(ngModel)]="newAlert.condition_type"><option value="above">Above</option><option value="below">Below</option></select>
        </div>
        <div class="form-group"><label>{{ 'alerts.targetPrice' | translate }}</label><input type="number" [(ngModel)]="newAlert.target_price" /></div>
        <div class="modal-footer">
          <button class="btn btn-ghost" (click)="showModal = false">{{ 'common.cancel' | translate }}</button>
          <button class="btn btn-primary" (click)="createAlert()">{{ 'common.save' | translate }}</button>
        </div>
      </div>
    </div>

    <div class="empty-state" *ngIf="loading"><div class="spinner"></div></div>
  `
})
export class AlertsComponent implements OnInit {
  alerts: PriceAlert[] = [];
  loading = true;
  showModal = false;
  newAlert: any = { condition_type: 'above' };

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.alertService.getAlerts().subscribe({
      next: (data) => { this.alerts = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  createAlert(): void {
    this.alertService.createAlert(this.newAlert).subscribe({
      next: (res) => { if (res.data) this.alerts.unshift(res.data); this.showModal = false; this.newAlert = { condition_type: 'above' }; }
    });
  }

  deleteAlert(id: number): void {
    this.alertService.deleteAlert(id).subscribe({
      next: () => { this.alerts = this.alerts.filter(a => a.id !== id); }
    });
  }
}
