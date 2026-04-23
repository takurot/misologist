import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Cormorant_Garamond, Lora, JetBrains_Mono } from 'next/font/google';
import { AppChrome } from '@/components/AppChrome';
import { LocaleProvider } from '@/components/LocaleProvider';
import { getDictionary, LOCALE_COOKIE, resolveLocale } from '@/lib/i18n';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export function generateMetadata(): Metadata {
  const locale = resolveLocale(cookies().get(LOCALE_COOKIE)?.value);
  const dict = getDictionary(locale);

  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = resolveLocale(cookies().get(LOCALE_COOKIE)?.value);

  return (
    <html lang={locale}>
      <body
        className={`${cormorant.variable} ${lora.variable} ${jetbrains.variable}`}
        style={{ fontFamily: 'var(--font-lora), Georgia, serif' }}
      >
        <LocaleProvider initialLocale={locale}>
          <AppChrome>{children}</AppChrome>
        </LocaleProvider>
      </body>
    </html>
  );
}
