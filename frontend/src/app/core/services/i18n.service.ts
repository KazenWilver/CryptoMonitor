import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private translations: any = {};
  private langSubject = new BehaviorSubject<string>(this.getStoredLang());
  public lang$ = this.langSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadTranslations(this.langSubject.value);
  }

  get currentLang(): string {
    return this.langSubject.value;
  }

  setLanguage(lang: string): void {
    localStorage.setItem('language', lang);
    this.langSubject.next(lang);
    this.loadTranslations(lang);
  }

  translate(key: string): string {
    const keys = key.split('.');
    let result: any = this.translations;
    for (const k of keys) {
      result = result?.[k];
    }
    return result || key;
  }

  private loadTranslations(lang: string): void {
    this.http.get<any>(`/assets/i18n/${lang}.json`).subscribe({
      next: (data) => { this.translations = data; },
      error: () => { console.warn(`Translation file for '${lang}' not found`); }
    });
  }

  private getStoredLang(): string {
    return localStorage.getItem('language') || 'pt';
  }
}
