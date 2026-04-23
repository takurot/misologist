'use client';

import Link from 'next/link';
import { useLocale } from '@/components/LocaleProvider';
import { LanguageToggle } from '@/components/LanguageToggle';

export function AppChrome({ children }: { children: React.ReactNode }) {
  const { dict } = useLocale();

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderBottom: '1px solid hsl(25, 18%, 12%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          backgroundColor: 'hsla(25, 40%, 5%, 0.85)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: '1.4rem',
                  fontWeight: 300,
                  letterSpacing: '0.06em',
                  color: 'hsl(35, 25%, 88%)',
                  lineHeight: 1,
                }}
              >
                Misologist
              </span>
              <div
                style={{
                  fontSize: '0.55rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'hsl(30, 68%, 50%)',
                  fontFamily: 'var(--font-lora), serif',
                  marginTop: '1px',
                }}
              >
                {dict.brand.subtitle}
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-6">
              <Link href="/diagnosis" className="nav-link">
                {dict.nav.diagnosis}
              </Link>
              <Link href="/batches" className="nav-link">
                {dict.nav.batches}
              </Link>
              <Link href="/recipes" className="nav-link">
                {dict.nav.recipes}
              </Link>
              <Link href="/knowledge" className="nav-link">
                {dict.nav.knowledge}
              </Link>
            </nav>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main style={{ minHeight: 'calc(100vh - 4rem)' }}>
        {children}
      </main>

      <footer
        style={{
          borderTop: '1px solid hsl(25, 18%, 12%)',
          padding: '2rem 0',
          marginTop: '4rem',
        }}
      >
        <div
          className="max-w-6xl mx-auto px-6"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.65rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'hsl(35, 15%, 52%)',
            fontFamily: 'var(--font-lora), serif',
          }}
        >
          <span>{dict.footer.builtWith}</span>
          <span>{dict.footer.hackathon}</span>
        </div>
      </footer>
    </>
  );
}
