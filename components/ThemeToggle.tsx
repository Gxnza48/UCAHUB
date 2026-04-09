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
    return (
      <div className="w-14 h-7 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse border border-slate-200 dark:border-slate-700"></div>
    );
  }

  const isDark = theme === 'dark';

  return (
    <div 
      className="flex items-center gap-3 cursor-pointer group"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <div className={`relative w-14 h-7 rounded-full transition-all duration-500 ease-in-out border
        ${isDark 
          ? 'bg-primary/20 border-primary/30 shadow-[0_0_15px_rgba(79,70,229,0.2)]' 
          : 'bg-slate-100 border-slate-200'
        }`}
      >
        {/* Thumb */}
        <div className={`absolute top-1 left-1 w-5 h-5 rounded-full shadow-lg transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-center
          ${isDark 
            ? 'translate-x-[1.75rem] bg-indigo-500' 
            : 'translate-x-0 bg-white'
          }`}
        >
          {isDark ? (
            <Moon className="w-3 h-3 text-white fill-white" />
          ) : (
            <Sun className="w-3 h-3 text-slate-400" />
          )}
        </div>
      </div>
      
      <span className="sr-only">Toggle theme</span>
    </div>
  )
}
