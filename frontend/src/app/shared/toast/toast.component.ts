import { Component } from '@angular/core';
import { ToastService, Toast } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: false,
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of (toastService.toasts$ | async)"
           class="toast-item"
           [ngClass]="'toast-' + toast.type"
           (click)="toastService.dismiss(toast.id)">
        <span class="toast-icon">
          {{ toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : toast.type === 'warning' ? '⚠' : 'ℹ' }}
        </span>
        <span class="toast-msg">{{ toast.message }}</span>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed; top: 20px; right: 20px; z-index: 9999;
      display: flex; flex-direction: column; gap: 8px;
      max-width: 380px;
    }
    .toast-item {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 16px; border-radius: 10px;
      background: var(--bg-surface); border: 1px solid var(--border);
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      cursor: pointer; animation: toastSlideIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      backdrop-filter: blur(12px);
      font-size: 13px; color: var(--text-primary);
    }
    .toast-icon {
      width: 24px; height: 24px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700; flex-shrink: 0;
    }
    .toast-success .toast-icon { background: rgba(61,214,140,0.2); color: var(--color-success); }
    .toast-error .toast-icon { background: rgba(235,87,87,0.2); color: var(--color-error); }
    .toast-warning .toast-icon { background: rgba(240,192,0,0.2); color: var(--color-warning); }
    .toast-info .toast-icon { background: rgba(94,106,210,0.2); color: var(--color-primary); }
    .toast-success { border-left: 3px solid var(--color-success); }
    .toast-error { border-left: 3px solid var(--color-error); }
    .toast-warning { border-left: 3px solid var(--color-warning); }
    .toast-info { border-left: 3px solid var(--color-primary); }
    @keyframes toastSlideIn {
      from { transform: translateX(120%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
