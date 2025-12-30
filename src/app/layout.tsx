import type { Metadata } from 'next';
import './globals.css';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '智绘-CleanShot',
  description: 'AI-powered document processing, matting, and watermark removal service',
  icons: {
    icon: '/images/demo/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <div className="min-h-screen bg-base-100">
          {/* Header */}
          <header className="navbar bg-base-200 shadow-lg">
            <div className="container mx-auto">
              <div className="flex-1">
                <Link href="/" className="btn btn-ghost normal-case text-xl">
                  智绘-CleanShot
                </Link>
              </div>
              <div className="flex-none gap-2">
                <ul className="menu menu-horizontal px-1">
                  <li><Link href="/">首页</Link></li>
                  <li><Link href="/processing">处理</Link></li>
                  <li><Link href="/report">性能报告</Link></li>
                </ul>
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="footer footer-center p-4 bg-base-200 text-base-content mt-12">
            <div>
              <p>
                Powered by 智绘-CleanShot Service | Chengdu Neusoft University
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
