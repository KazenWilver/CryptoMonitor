import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  template: `
    <div class="app-layout">
      <app-sidebar></app-sidebar>
      <div class="main-area">
        <app-header></app-header>
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {}
