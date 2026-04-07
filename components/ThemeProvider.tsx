'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ 
  children, 
  ...props 
}: { 
  children: React.ReactNode; 
  defaultTheme?: string; 
  enableSystem?: boolean;
  attribute?: any;
  disableTransitionOnChange?: boolean;
}) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
