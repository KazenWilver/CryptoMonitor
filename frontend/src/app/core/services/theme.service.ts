import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<string>(this.getStoredTheme());
  public theme$ = this.themeSubject.asObservable();

  constructor() {
    this.applyTheme(this.themeSubject.value);
  }

  get currentTheme(): string {
    return this.themeSubject.value;
  }

  get isDark(): boolean {
    return this.currentTheme === 'dark';
  }

  toggleTheme(): void {
    const newTheme = this.isDark ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  setTheme(theme: string): void {
    this.applyTheme(theme);
    localStorage.setItem('theme', theme);
    this.themeSubject.next(theme);
  }

  private applyTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  private getStoredTheme(): string {
    return localStorage.getItem('theme') || 'dark';
  }
}
