import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { LocalizedText } from '../types/heritage';
import { dict } from './dictionary';

export type Lang = 'ko' | 'en';

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  /** UI string by key from the dictionary. */
  t: (key: string) => string;
  /** Pick the current language from a {ko,en} data field. */
  tl: (text?: LocalizedText | null) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

const STORAGE_KEY = 'dot-heritage-lang';

function initialLang(): Lang {
  if (typeof window === 'undefined') return 'ko';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === 'ko' || saved === 'en') return saved;
  return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'ko';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch { /* ignore */ }
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggle = useCallback(() => setLangState((l) => (l === 'ko' ? 'en' : 'ko')), []);

  const t = useCallback(
    (key: string) => {
      const entry = dict[key];
      if (!entry) return key;
      return entry[lang] ?? entry.ko ?? key;
    },
    [lang],
  );

  const tl = useCallback(
    (text?: LocalizedText | null) => {
      if (!text) return '';
      return text[lang] ?? text.ko ?? '';
    },
    [lang],
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, toggle, t, tl }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
