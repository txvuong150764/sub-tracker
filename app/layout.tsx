import type { Metadata } from 'next';
import './globals.css';
import './fanta.css';
import Head from './head';
import Link from 'next/link';
import GoTo from '@/components/GoTo';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'The Subsctiption Tracker',
  description: 'Track all your subscription analytics',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const header = (
    <header>
      <div>
        <Link href={'/'}>
          <h1 className="text-gradient">SubTrack</h1>
        </Link>
        <p>Track Your Subscription</p>
      </div>
      <GoTo />
    </header>
  );

  const footer = (
    <footer>
      <div className="hard-line" />
      <div className="footer-content">
        <div>
          <div>
            <h4>SubTrack</h4>
            <p>|</p>
            <button disabled>Install App</button>
          </div>
          <p className="copyright">
            © Copyright 2024-2025, Vuong Tran.
            <br />
            All rights reserved.
          </p>
        </div>
        <div>
          <p>
            Facing issues? <a>Get help</a>
          </p>
          <p>
            Suggestions for improvement? <a>Share feedback</a>
          </p>
          <div>
            <Link href={'/privacy'}>Privacy Policy</Link>
            <Link href={'/tos'}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );

  return (
    <html lang="en">
      <Head />
      <AuthProvider>
        <body suppressHydrationWarning={true}>
          {header}
          <div className="full-line" />
          <main>{children}</main>
          {footer}
        </body>
      </AuthProvider>
    </html>
  );
}
