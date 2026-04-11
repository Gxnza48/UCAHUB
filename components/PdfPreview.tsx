'use client'

import React, { useState, useEffect } from 'react';
import { Loader2, ExternalLink } from 'lucide-react';

export function PdfPreview({ fileUrl }: { fileUrl: string }) {
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [viewerUrl, setViewerUrl] = useState('');

  useEffect(() => {
    const checkMobile = () => {
      const mobileStatus = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobileStatus);
      
      // Cache bust and construct the correct URL
      if (mobileStatus) {
        setViewerUrl(`https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true&cb=${Date.now()}`);
      } else {
        setViewerUrl(`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [fileUrl]);

  return (
    <div className="w-full h-full relative bg-slate-50 dark:bg-[#0f172a] overflow-hidden">
      {/* Diagnostic marker for the user to confirm deployment */}
      <div className="absolute top-1 right-1 z-50 text-[6px] text-slate-300 pointer-events-none opacity-50">
        v2.2-stable
      </div>

      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-background/80 backdrop-blur-sm z-10 transition-opacity duration-300">
          <div className="relative mb-8">
            <div className="w-24 h-32 bg-white dark:bg-slate-800 rounded-xl shadow-2xl animate-pulse border border-primary/10 flex flex-col relative overflow-hidden">
              <div className="p-4 space-y-3 mt-4">
                <div className="h-2 bg-primary/10 rounded-full w-3/4"></div>
                <div className="h-2 bg-primary/5 rounded-full w-full"></div>
                <div className="h-2 bg-primary/10 rounded-full w-5/6"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            </div>
          </div>
          <p className="font-bold text-primary/40 text-[10px] tracking-[0.2em] uppercase animate-pulse font-headline">Cargando Previsualización</p>
        </div>
      )}
      
      {viewerUrl && (
        <iframe
          src={viewerUrl}
          key={viewerUrl}
          className={`w-full h-full border-0 transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          title="Vista previa del recurso"
        />
      )}

      {isMobile && !loading && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center px-4 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-500">
          <a 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-premium bg-white/95 backdrop-blur-md text-primary px-6 py-3 rounded-xl flex items-center gap-2 shadow-2xl active:scale-95 transition-all text-[10px] font-black uppercase tracking-widest border border-primary/10 pointer-events-auto"
          >
            <ExternalLink className="w-3 h-3" />
            Abrir Original
          </a>
        </div>
      )}
    </div>
  );
}
