import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Misologist - 発酵診断エンジン',
  description: '味噌の発酵状態をAIで診断・管理するシステム',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <nav className="border-b bg-card">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg text-primary">
              Misologist
            </Link>
            <div className="flex gap-6 text-sm">
              <Link href="/diagnosis" className="hover:text-primary transition-colors">
                発酵診断
              </Link>
              <Link href="/batches" className="hover:text-primary transition-colors">
                バッチ管理
              </Link>
              <Link href="/knowledge" className="hover:text-primary transition-colors">
                知識翻訳
              </Link>
            </div>
          </div>
        </nav>
        <main className="min-h-[calc(100vh-3.5rem)]">
          {children}
        </main>
      </body>
    </html>
  );
}
