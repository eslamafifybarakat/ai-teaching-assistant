export type LangCode = 'ar' | 'en' | 'zh' | 'ru' | 'ja' | 'hi';

export interface LangDefinition {
  code: LangCode;
  nativeName: string;
  englishName: string;
  dir: 'rtl' | 'ltr';
  flag: string;
}

export const SUPPORTED_LANGUAGES: LangDefinition[] = [
  { code: 'ar', nativeName: 'العربية', englishName: 'Arabic', dir: 'rtl', flag: '🇸🇦' },
  { code: 'en', nativeName: 'English', englishName: 'English', dir: 'ltr', flag: '🇺🇸' },
  { code: 'zh', nativeName: '中文', englishName: 'Chinese', dir: 'ltr', flag: '🇨🇳' },
  { code: 'ru', nativeName: 'Русский', englishName: 'Russian', dir: 'ltr', flag: '🇷🇺' },
  { code: 'ja', nativeName: '日本語', englishName: 'Japanese', dir: 'ltr', flag: '🇯🇵' },
  { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi', dir: 'ltr', flag: '🇮🇳' },
];

export const DEFAULT_LANG: LangCode = 'ar';
