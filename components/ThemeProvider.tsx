'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ComponentProps, ReactNode } from 'react';

export const Providers = ({ children, ...props }: ComponentProps<typeof NextThemesProvider>): ReactNode => {
  return (
    <NextThemesProvider {...props}>
      <SessionProvider>{children}</SessionProvider>
    </NextThemesProvider>
  );
};
