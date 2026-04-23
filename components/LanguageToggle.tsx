'use client';

import type { Locale } from '@/lib/i18n';
import { useLocale } from '@/components/LocaleProvider';

const locales: Locale[] = ['en', 'ja'];

export function LanguageToggle() {
  const { locale, setLocale, dict } = useLocale();

  return (
    <div
      aria-label={dict.language.label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        border: '1px solid hsl(25, 18%, 18%)',
        padding: '0.2rem',
      }}
    >
      {locales.map((value) => {
        const isActive = value === locale;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setLocale(value)}
            aria-pressed={isActive}
            style={{
              border: 'none',
              cursor: 'pointer',
              padding: '0.45rem 0.75rem',
              background: isActive ? 'hsl(30, 50%, 12%)' : 'transparent',
              color: isActive ? 'hsl(30, 68%, 55%)' : 'hsl(35, 15%, 60%)',
              fontFamily: 'var(--font-lora), serif',
              fontSize: '0.65rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            {dict.language[value]}
          </button>
        );
      })}
    </div>
  );
}
