'use client'

import React, { useState, useEffect } from 'react';
import { Loader2, ExternalLink, FileText } from 'lucide-react';

export function PdfPreview({ fileUrl }: { fileUrl: string }) {
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full h-full relative bg-slate-50 dark:bg-[#0f172a]">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-slate-50/80 dark:bg-[#0f172a]/80 backdrop-blur-sm z-10 transition-opacity duration-300">
          <div className="relative mb-6">
            <div className="w-20 h-28 bg-white dark:bg-slate-800 rounded-lg shadow-xl animate-pulse border border-slate-200 dark:border-slate-700 flex flex-col relative overflow-hidden">
             
              {/* Skeleton lines representing text */}
              <div className="p-3 space-y-3 mt-4">
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full w-3/4 animate-pulse"></div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full w-full animate-pulse delay-75"></div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full w-5/6 animate-pulse delay-150"></div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full w-full animate-pulse delay-200"></div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full w-4/6 animate-pulse delay-300"></div>
              </div>
              
              {/* Spinning Loader Overlay */}
              <div className="absolute inset-0 bg-white/20 dark:bg-black/20 flex items-center justify-center backdrop-blur-[1px]">
                 <Loader2 className="w-8 h-8 text-primary-container dark:text-blue-500 animate-spin" />
              </div>
            </div>
            
            {/* Shimmer effect traversing the skeleton structure */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]"></div>
          </div>
          <p className="font-bold text-slate-500 dark:text-slate-400 text-sm tracking-wide uppercase animate-pulse">Renderizando vista previa...</p>
        </div>
      )}
      
      {isMobile ? (
        <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-20 h-20 bg-[#1d3b6f]/10 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-[#1d3b6f] dark:text-blue-400 mb-6 border border-[#1d3b6f]/20 dark:border-blue-500/20">
            <FileText className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Vista previa optimizada</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 max-w-[240px]">Para una mejor experiencia en móvil, abre el documento en una pestaña nueva.</p>
          <a 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#1d3b6f] dark:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 shadow-xl active:scale-95 transition-all w-full justify-center"
            onClick={() => setLoading(false)}
          >
            <ExternalLink className="w-5 h-5" />
            Abrir PDF completo
          </a>
        </div>
      ) : (
        <iframe
          src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          className={`w-full h-full border-0 transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setLoading(false)}
          title="Vista previa del PDF interactiva"
        />
      )}
    </div>
  );
}
