import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/header';
import { ContactModalProvider } from '@/lib/contact-modal-context';
import { getSettings } from '@/actions/settings';
import { getContacts } from '@/actions/contacts';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

// Каждая страница зависит от cookies (сессия Supabase), так что сайт в любом
// случае не может быть статическим — явно объявляем это, чтобы Next.js не
// пытался сгенерировать страницы статически на этапе сборки.
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: `${settings.shop_name} — Магазин мебели`,
    description: 'Качественная мебель по доступным ценам с доставкой по всей стране',
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, contacts] = await Promise.all([getSettings(), getContacts()]);

  return (
    <html lang="ru">
      <body className={inter.className}>
        <ContactModalProvider shopName={settings.shop_name} contacts={contacts}>
          <Header shopName={settings.shop_name} />
          <main>{children}</main>
        </ContactModalProvider>
      </body>
    </html>
  );
}
