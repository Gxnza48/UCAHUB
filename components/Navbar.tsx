'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Compass, PlusCircle, User, Bell, LogOut, Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { NotificationsMenu } from './NotificationsMenu';

export default function Navbar({ user }: { user: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <nav suppressHydrationWarning className="fixed w-full top-0 z-50 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        
        <div className="flex items-center gap-8">
          <Link href={user ? "/hub" : "/"} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image src="/logo-horizontal.png" alt="UCAHUB Logo" width={140} height={40} className="h-10 w-auto object-contain" />
          </Link>
          
          {user && (
            <div className="hidden md:flex items-center gap-2 font-body font-bold text-sm">
              <Link href="/hub" className={`px-4 py-2 rounded-full transition-all duration-300 ${pathname === '/hub' ? 'bg-[#1D3B6F] text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}>
                Explorar
              </Link>
              <Link href="/upload" className={`px-4 py-2 rounded-full transition-all duration-300 ${pathname === '/upload' ? 'bg-[#1D3B6F] text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}>
                Subir
              </Link>
              <Link href="/profile" className={`px-4 py-2 rounded-full transition-all duration-300 ${pathname === '/profile' ? 'bg-[#1D3B6F] text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}>
                Mis Archivos
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <NotificationsMenu />
              <Link href="/profile" className="text-primary dark:text-blue-400 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all active:scale-95 duration-200" title="Perfil">
                <User className="w-5 h-5" />
              </Link>
              <button onClick={handleSignOut} className="text-red-500 dark:text-red-400 p-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-all active:scale-95 duration-200" title="Cerrar Sesión">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/auth" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors">
                Ingresar
              </Link>
              <Link href="/auth" className="text-sm font-bold bg-[#1D3B6F] dark:bg-blue-600 text-white px-5 py-2 rounded-full hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-95 transition-all">
                Registrarse
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl p-4 flex flex-col gap-4">
           {user ? (
             <>
               <Link href="/hub" onClick={() => setMobileMenuOpen(false)} className={`p-3 rounded-lg font-bold ${pathname === '/hub' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300'}`}>Explorar</Link>
               <Link href="/upload" onClick={() => setMobileMenuOpen(false)} className={`p-3 rounded-lg font-bold ${pathname === '/upload' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300'}`}>Subir Archivo</Link>
               <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className={`p-3 rounded-lg font-bold ${pathname === '/profile' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300'}`}>Mi Perfil</Link>
               <button onClick={handleSignOut} className="p-3 text-left rounded-lg font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">Cerrar Sesión</button>
             </>
           ) : (
             <>
               <Link href="/auth" onClick={() => setMobileMenuOpen(false)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg font-bold text-center text-slate-700 dark:text-slate-200">Ingresar a mi cuenta</Link>
             </>
           )}
        </div>
      )}
    </nav>
  );
}
