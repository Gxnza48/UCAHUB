import React from 'react';

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-8 h-8 flex items-center justify-center">
        {/* Abstract minimalistic shield/hub shape */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          <path 
            d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="8" 
            className="text-primary"
          />
          <path 
            d="M30 40 L50 60 L70 40" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="8" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-cta"
          />
        </svg>
      </div>
      <span className="font-headline font-black text-2xl tracking-tighter text-slate-900 dark:text-white">
        UCA<span className="text-cta font-extrabold">HUB</span>
      </span>
    </div>
  );
};
