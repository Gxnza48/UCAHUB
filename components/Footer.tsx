import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer suppressHydrationWarning className="w-full py-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 transition-colors duration-300 relative z-10">
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
