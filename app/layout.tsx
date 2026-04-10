import { Outfit, Inter } from 'next/font/google';
import { createClient } from "@/utils/supabase/server";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import SmoothScroll from '@/components/SmoothScroll';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-headline',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: "UCAHUB",
  description: "Todos tus recursos universitarios en un solo lugar.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="es" suppressHydrationWarning className={`${outfit.variable} ${inter.variable}`}>
      <body suppressHydrationWarning className="bg-background text-text flex flex-col min-h-screen transition-colors duration-300 font-body">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SmoothScroll>
            <Navbar user={user} />
            <main className="flex-grow flex flex-col w-full relative pt-16">
              {children}
            </main>
            <Footer />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
