import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/header';
import { ContactModalProvider } from '@/lib/contact-modal-context';
import { getSettings } from '@/actions/settings';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'МебельГрад — Магазин мебели',
  description: 'Качественная мебель по доступным ценам с доставкой по всей стране',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <html lang="ru">
      <body className={inter.className}>
        <ContactModalProvider settings={settings}>
          <Header />
          <main>{children}</main>
        </ContactModalProvider>
      </body>
    </html>
  );
}
