import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    TestBed.configureTestingModule({});
  });

  it('defaults to light and sets no data-theme attribute', () => {
    const service = TestBed.inject(ThemeService);
    expect(service.mode()).toBe('light');
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('marks the document element when switched to dark', () => {
    const service = TestBed.inject(ThemeService);
    service.set('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('toggles back to light and clears the attribute', () => {
    const service = TestBed.inject(ThemeService);
    service.toggle();
    service.toggle();
    expect(service.mode()).toBe('light');
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('persists the choice so a reload restores it', () => {
    TestBed.inject(ThemeService).set('dark');
    expect(localStorage.getItem('ata_theme')).toBe('dark');
  });
});
