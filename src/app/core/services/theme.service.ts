import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';
const STORAGE_KEY = 'ata_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly mode = signal<ThemeMode>(this.readInitial());

  constructor() {
    this.apply(this.mode());
  }

  private readInitial(): ThemeMode {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'light';
  }

  toggle(): void {
    this.set(this.mode() === 'light' ? 'dark' : 'light');
  }

  set(mode: ThemeMode): void {
    this.mode.set(mode);
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, mode);
    this.apply(mode);
  }

  private apply(mode: ThemeMode): void {
    if (typeof document === 'undefined') return;
    if (mode === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
  }
}
