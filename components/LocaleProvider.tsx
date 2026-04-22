'use client';

import {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';
import {
  getDictionary,
  LOCALE_COOKIE,
  LOCALE_STORAGE_KEY,
  type Locale,
} from '@/lib/i18n';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: ReturnType<typeof getDictionary>;
}

const defaultLocale: Locale = 'en';

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  setLocale: () => {},
  dict: getDictionary(defaultLocale),
});

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      dict: getDictionary(locale),
    }),
    [locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
