import type { Metadata } from 'next';
import './globals.css';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: '智绘-CleanShot',
  description: 'AI-powered document processing, matting, and watermark removal service',
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
                <h1 className="text-2xl font-bold text-base-content">
                  智绘-CleanShot
                </h1>
              </div>
              <div className="flex-none">
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
