import { createClient } from "@/utils/supabase/server";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: "UCAHUB | Recursos Universitarios",
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
    <html lang="es" suppressHydrationWarning className="scroll-smooth" style={{ scrollBehavior: 'smooth' }} data-scroll-behavior="smooth">
      <body suppressHydrationWarning className="bg-background text-on-surface font-body selection:bg-primary-container selection:text-white flex flex-col min-h-screen transition-colors duration-300 dark:bg-[#0f172a] dark:text-slate-200">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar user={user} />
          <main className="flex-grow mb-auto flex flex-col w-full relative pt-16">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
