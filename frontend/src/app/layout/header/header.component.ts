import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: false,
  template: `
    <header class="app-header">
      <div class="header-search">
        <input type="text" [(ngModel)]="searchQuery"
               (keydown.enter)="onSearch()"
               placeholder="{{ 'common.search' | translate }}..."
               class="search-input" />
      </div>
      <div class="header-right">
        <span class="user-name">{{ auth.currentUser?.name }}</span>
        <span class="user-role chip" [class.chip-positive]="auth.isAdmin">
          {{ auth.currentUser?.role }}
        </span>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  searchQuery = '';

  constructor(public auth: AuthService, private router: Router) {}

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/market'], { queryParams: { q: this.searchQuery.trim() } });
    }
  }
}
