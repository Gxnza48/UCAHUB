import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer suppressHydrationWarning className="w-full py-16 bg-white dark:bg-black border-t border-slate-200 dark:border-white/5 transition-colors duration-300 relative z-10">
      {/* Wave Transition Top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] -translate-y-[99%] z-[1]">
        <svg className="relative block w-[calc(100%+1.3px)] h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,10.18,20,32,32,45.24,39.33,96.67,51.33,121.19,53,165.41,56,263.39,67.23,321.39,56.44Z" fill="currentColor" className="text-white dark:text-black"></path>
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <span className="font-headline font-bold text-3xl tracking-tight text-primary">UCA<span className="text-cta">HUB</span></span>
          </Link>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-body max-w-xs text-center md:text-left leading-relaxed">
            El ecosistema de recursos compartidos para la comunidad de la Universidad Católica Argentina.
          </p>
        </div>
        
        <div className="flex justify-center gap-12 text-sm font-bold font-headline uppercase tracking-widest text-[#1D3B6F] dark:text-blue-400">
          <Link href="/hub" className="hover:text-cta transition-colors">Explorar</Link>
          <Link href="/upload" className="hover:text-cta transition-colors">Subir</Link>
          <Link href="/leaderboard" className="hover:text-cta transition-colors">Ranking</Link>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-2">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 font-headline">
            Desarrollado por <a href="https://github.com/Gxnza48" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-cta transition-colors">Gxnza48</a>
          </p>
          <p className="text-[10px] uppercase tracking-tighter text-slate-400 dark:text-slate-500 font-bold">
            © {new Date().getFullYear()} UCAHUB Academia. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
