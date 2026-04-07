'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 animate-pulse border border-slate-200 dark:border-slate-700"></div>;
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm border overflow-hidden active:scale-90 group
        ${isDark 
          ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700 hover:shadow-yellow-400/20 shadow-[0_0_15px_rgba(250,204,21,0.1)]' 
          : 'bg-white border-slate-200 text-[#1d3b6f] hover:bg-slate-50 hover:shadow-[#1d3b6f]/20 hover:border-slate-300'
        }`}
      title={isDark ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
    >
      <div className={`absolute inset-0 bg-gradient-to-tr transition-opacity duration-500 ${isDark ? 'from-yellow-400/10 to-transparent opacity-100' : 'from-[#1d3b6f]/5 to-transparent opacity-100'}`}></div>
      
      <Sun className={`relative z-10 w-5 h-5 transition-all duration-500 ease-in-out ${isDark ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100 group-hover:rotate-[30deg]'}`} />
      
      <Moon className={`absolute z-10 w-5 h-5 transition-all duration-500 ease-in-out ${isDark ? 'rotate-0 scale-100 opacity-100 group-hover:-rotate-12' : 'rotate-90 scale-0 opacity-0'}`} />
      
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
