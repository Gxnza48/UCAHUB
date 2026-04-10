'use client'

import React, { useState, useEffect } from 'react';
import { Loader2, ExternalLink, FileText } from 'lucide-react';

export function PdfPreview({ fileUrl }: { fileUrl: string }) {
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobileStatus = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobileStatus);
      if (mobileStatus) {
        // If mobile, the iframe never renders to fire onLoad, so clear loading manually.
        setLoading(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full h-full relative bg-slate-50 dark:bg-[#0f172a]">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-background/80 backdrop-blur-sm z-10 transition-opacity duration-300">
          <div className="relative mb-8">
            <div className="w-24 h-32 bg-white dark:bg-slate-800 rounded-xl shadow-2xl animate-pulse border border-primary/10 flex flex-col relative overflow-hidden">
              
              <div className="p-4 space-y-3 mt-4">
                <div className="h-2 bg-primary/10 rounded-full w-3/4 animate-pulse"></div>
                <div className="h-2 bg-primary/5 rounded-full w-full animate-pulse delay-75"></div>
                <div className="h-2 bg-primary/10 rounded-full w-5/6 animate-pulse delay-150"></div>
                <div className="h-2 bg-primary/5 rounded-full w-full animate-pulse delay-200"></div>
              </div>
              
              <div className="absolute inset-0 bg-white/10 dark:bg-black/10 flex items-center justify-center backdrop-blur-[1px]">
                 <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            </div>
          </div>
          <p className="font-bold text-primary/40 text-xs tracking-[0.3em] uppercase animate-pulse font-headline">Compilando vista previa académica</p>
        </div>
      )}
      
      {isMobile ? (
        <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="w-24 h-24 liquid-glass rounded-3xl flex items-center justify-center text-primary mb-8 border-primary/20 shadow-xl">
            <FileText className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-bold text-text dark:text-white mb-4 font-headline">Vista Previa Optimizada</h3>
          <p className="text-slate-500 font-body text-lg mb-12 max-w-[280px]">Para una lectura profunda en dispositivos móviles, recomendamos abrir el documento completo.</p>
          <a 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-premium bg-primary text-white px-10 py-5 flex items-center gap-4 shadow-xl active:scale-95 transition-all w-full justify-center"
            onClick={() => setLoading(false)}
          >
            <ExternalLink className="w-5 h-5" />
            Abrir Documento Completo
          </a>
        </div>
      ) : (
        <iframe
          src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          className={`w-full h-full border-0 transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setLoading(false)}
          title="Vista previa del PDF interactiva"
        />
      )}
    </div>
  );
}
