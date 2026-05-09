import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin',
  standalone: false,
  template: `
    <div class="page-header">
      <h3 class="page-title">{{ 'nav.admin' | translate }}</h3>
    </div>

    <!-- Stats -->
    <div class="stats-grid mb-24" *ngIf="stats">
      <div class="stat-card">
        <div class="stat-label">Total Utilizadores</div>
        <div class="stat-value mono">{{ stats.total_users }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Exportações</div>
        <div class="stat-value mono">{{ stats.total_exports }}</div>
      </div>
    </div>

    <!-- Users -->
    <div class="card" *ngIf="users.length > 0">
      <h5 class="mb-16">Gestão de Utilizadores</h5>
      <table>
        <thead><tr><th>ID</th><th>Nome</th><th>Email</th><th>Role</th><th>Estado</th><th>Registo</th><th>Ações</th></tr></thead>
        <tbody>
          <tr *ngFor="let u of users">
            <td class="mono">{{ u.id }}</td>
            <td style="font-weight:500">{{ u.name }}</td>
            <td class="metadata">{{ u.email }}</td>
            <td><span class="chip" [ngClass]="u.role === 'admin' ? 'chip-positive' : 'chip-neutral'">{{ u.role }}</span></td>
            <td><span class="chip" [ngClass]="u.is_active ? 'chip-positive' : 'chip-negative'">{{ u.is_active ? 'Ativo' : 'Inativo' }}</span></td>
            <td class="metadata">{{ u.created_at | date:'dd/MM/yyyy' }}</td>
            <td>
              <button class="btn btn-sm btn-ghost" (click)="toggleActive(u)" *ngIf="u.role !== 'admin'">
                {{ u.is_active ? 'Desativar' : 'Ativar' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="empty-state" *ngIf="loading"><div class="spinner"></div></div>
  `
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  stats: any = null;
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const api = environment.apiUrl;
    this.http.get<any>(`${api}/api/admin/users`).subscribe({
      next: (res) => { this.users = res.data?.users || []; this.loading = false; },
      error: () => { this.loading = false; }
    });
    this.http.get<any>(`${api}/api/admin/stats`).subscribe({
      next: (res) => { this.stats = res.data; }
    });
  }

  toggleActive(user: any): void {
    const api = environment.apiUrl;
    this.http.put<any>(`${api}/api/admin/users/${user.id}`, { is_active: !user.is_active }).subscribe({
      next: (res) => { if (res.data) { const i = this.users.findIndex(u => u.id === user.id); if (i >= 0) this.users[i] = res.data; } }
    });
  }
}
