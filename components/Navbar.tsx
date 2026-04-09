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
    <nav suppressHydrationWarning className="fixed w-full top-0 z-50 transition-all duration-300 px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-6 bg-white/70 dark:bg-black/40 backdrop-blur-3xl border border-white/20 dark:border-white/10 shadow-xl dark:shadow-none rounded-2xl transition-all duration-300">
        
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="font-headline font-bold text-2xl tracking-tight text-primary">UCA<span className="text-cta">HUB</span></span>
          </Link>
          
          {user && (
            <div className="hidden md:flex items-center gap-1 font-body font-bold text-sm">
              <Link href="/hub" className={`px-4 py-2 rounded-xl transition-all duration-300 ${pathname === '/hub' ? 'bg-primary text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-primary dark:hover:text-blue-400'}`}>
                Explorar
              </Link>
              <Link href="/upload" className={`px-4 py-2 rounded-xl transition-all duration-300 ${pathname === '/upload' ? 'bg-primary text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-primary dark:hover:text-blue-400'}`}>
                Subir
              </Link>
              <Link href="/profile" className={`px-4 py-2 rounded-xl transition-all duration-300 ${pathname === '/profile' ? 'bg-primary text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-primary dark:hover:text-blue-400'}`}>
                Mis Archivos
              </Link>
              <Link href="/leaderboard" className={`px-4 py-2 rounded-xl transition-all duration-300 ${pathname === '/leaderboard' ? 'bg-primary text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-primary dark:hover:text-blue-400'}`}>
                Hall de la Fama
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <NotificationsMenu />
              <Link href="/profile" className="text-primary dark:text-blue-400 p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-full transition-all active:scale-95 duration-200" title="Perfil">
                <User className="w-5 h-5" />
              </Link>
              <button onClick={handleSignOut} className="text-red-500 dark:text-red-400 p-2 hover:bg-red-50/50 dark:hover:bg-red-950/30 rounded-full transition-all active:scale-95 duration-200" title="Cerrar Sesión">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/auth" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors">
                Ingresar
              </Link>
              <Link href="/auth" className="text-sm font-bold bg-cta text-white px-5 py-2 rounded-xl hover:shadow-lg hover:shadow-cta/20 hover:-translate-y-0.5 active:scale-95 transition-all">
                Registrarse
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-24 left-4 right-4 liquid-glass rounded-2xl shadow-xl p-4 flex flex-col gap-2">
           {user ? (
             <>
               <Link href="/hub" onClick={() => setMobileMenuOpen(false)} className={`p-3 rounded-xl font-bold ${pathname === '/hub' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300'}`}>Explorar</Link>
               <Link href="/upload" onClick={() => setMobileMenuOpen(false)} className={`p-3 rounded-xl font-bold ${pathname === '/upload' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300'}`}>Subir Archivo</Link>
               <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className={`p-3 rounded-xl font-bold ${pathname === '/profile' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300'}`}>Mi Perfil</Link>
               <button onClick={handleSignOut} className="p-3 text-left rounded-xl font-bold text-red-500 hover:bg-red-50/50">Cerrar Sesión</button>
             </>
           ) : (
             <>
               <Link href="/auth" onClick={() => setMobileMenuOpen(false)} className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl font-bold text-center text-slate-700 dark:text-slate-200">Ingresar a mi cuenta</Link>
             </>
           )}
        </div>
      )}
    </nav>
  );
}
