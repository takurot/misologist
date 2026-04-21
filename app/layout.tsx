import type { Metadata } from 'next';
import { Cormorant_Garamond, Lora, JetBrains_Mono } from 'next/font/google';
import Link from 'next/link';
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

export const metadata: Metadata = {
  title: 'Misologist — 発酵診断・職人知識継承エンジン',
  description: '味噌の発酵状態をClaude Opus 4.7で診断・管理。職人の暗黙知を発酵化学に翻訳します。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body
        className={`${cormorant.variable} ${lora.variable} ${jetbrains.variable}`}
        style={{ fontFamily: 'var(--font-lora), Georgia, serif' }}
      >
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
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none' }}>
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
                  発酵診断 / 知識継承エンジン
                </div>
              </div>
            </Link>

            {/* Nav */}
            <nav className="flex items-center gap-8">
              <Link href="/diagnosis" className="nav-link">
                Diagnose
              </Link>
              <Link href="/batches" className="nav-link">
                Batches
              </Link>
              <Link href="/knowledge" className="nav-link">
                Knowledge
              </Link>
            </nav>
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
            <span>Misologist — Built with Claude Opus 4.7</span>
            <span>Anthropic Hackathon 2025</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
