'use client';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { ContactModal } from '@/components/contact-modal';

type Settings = Record<string, string>;

const ContactModalContext = createContext<{ open: () => void } | null>(null);

export function ContactModalProvider({ settings, children }: { settings: Settings; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ContactModalContext.Provider value={{ open: () => setIsOpen(true) }}>
      {children}
      <ContactModal open={isOpen} onClose={() => setIsOpen(false)} settings={settings} />
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const ctx = useContext(ContactModalContext);
  if (!ctx) throw new Error('useContactModal должен использоваться внутри ContactModalProvider');
  return ctx;
}
