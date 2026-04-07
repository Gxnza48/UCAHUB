import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-12 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300 relative z-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/" className="font-headline font-black tracking-tighter text-2xl text-[#1D3B6F] dark:text-blue-400">
            UCAHUB
          </Link>
          <p className="text-slate-500 dark:text-slate-400 text-sm">El ecosistema de recursos universitarios.</p>
        </div>
        
        <div className="flex gap-8 text-sm font-medium">
          <Link href="/hub" className="text-slate-500 dark:text-slate-400 hover:text-primary-container dark:hover:text-blue-400 transition-colors">Explorar</Link>
          <Link href="/upload" className="text-slate-500 dark:text-slate-400 hover:text-primary-container dark:hover:text-blue-400 transition-colors">Subir Apuntes</Link>
          <a href="https://github.com/Gxnza48/Portfolio" target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-primary-container dark:hover:text-blue-400 transition-colors">Sobre Nosotros</a>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-1">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Made by <a href="https://github.com/Gxnza48" target="_blank" rel="noopener noreferrer" className="text-primary-container dark:text-blue-400 hover:underline">Gxnza48</a>
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 opacity-80">© {new Date().getFullYear()} UCAHUB Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
