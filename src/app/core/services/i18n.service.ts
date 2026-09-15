import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { DEFAULT_LANG, LangCode, LangDefinition, SUPPORTED_LANGUAGES } from '../models/lang.model';

type TranslationTree = Record<string, unknown>;

const STORAGE_KEY = 'ata_lang';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly translations = signal<Record<LangCode, TranslationTree>>({} as Record<LangCode, TranslationTree>);
  readonly currentLang = signal<LangCode>(this.readInitialLang());
  readonly currentDef = computed<LangDefinition>(
    () => SUPPORTED_LANGUAGES.find(l => l.code === this.currentLang())!
  );
  readonly ready = signal(false);

  private readonly http = inject(HttpClient);

  private readInitialLang(): LangCode {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) as LangCode | null;
      if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) return saved;
    }
    return DEFAULT_LANG;
  }

  async init(): Promise<void> {
    await Promise.all(SUPPORTED_LANGUAGES.map(l => this.loadLang(l.code)));
    this.applyDomAttributes(this.currentLang());
    this.ready.set(true);
  }

  private async loadLang(code: LangCode): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<TranslationTree>(`assets/i18n/${code}.json`));
      this.translations.update(t => ({ ...t, [code]: data }));
    } catch {
      this.translations.update(t => ({ ...t, [code]: {} }));
    }
  }

  setLang(code: LangCode): void {
    this.currentLang.set(code);
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, code);
    this.applyDomAttributes(code);
  }

  private applyDomAttributes(code: LangCode): void {
    if (typeof document === 'undefined') return;
    const def = SUPPORTED_LANGUAGES.find(l => l.code === code)!;
    document.documentElement.lang = code;
    document.documentElement.dir = def.dir;
  }

  translate(key: string, params?: Record<string, string | number>): string {
    const tree = this.translations()[this.currentLang()] ?? {};
    const fallbackTree = this.translations()['en'] ?? {};
    let value = this.resolvePath(tree, key) ?? this.resolvePath(fallbackTree, key) ?? key;
    if (typeof value !== 'string') value = key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }
    }
    return value;
  }

  private resolvePath(tree: TranslationTree, key: string): string | undefined {
    const parts = key.split('.');
    let cursor: unknown = tree;
    for (const part of parts) {
      if (cursor && typeof cursor === 'object' && part in (cursor as Record<string, unknown>)) {
        cursor = (cursor as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }
    return typeof cursor === 'string' ? cursor : undefined;
  }
}
