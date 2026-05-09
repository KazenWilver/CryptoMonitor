import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: false,
  template: `
    <header class="app-header">
      <div class="header-search">
        <input type="text" placeholder="{{ 'common.search' | translate }}..." class="search-input" />
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
  constructor(public auth: AuthService) {}
}
