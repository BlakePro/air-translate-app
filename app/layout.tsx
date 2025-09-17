import { ModeToggle } from '@/components/ModeToggle';
import { Providers } from '@/components/ThemeProvider';
import type { Metadata } from 'next';
import { ViewTransitions } from 'next-view-transitions';
import { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Live translation',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ViewTransitions>
      <html lang='en' suppressHydrationWarning>
        <head />
        <body className='antialised p-0 m-0 overflow-hidden'>
          <Providers attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
            {children}
            <div className='fixed top-3 right-3 z-40'>
              <ModeToggle />
            </div>
          </Providers>
        </body>
      </html>
    </ViewTransitions>
  );
}
