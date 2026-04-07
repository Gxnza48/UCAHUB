'use client'

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

export function PdfPreview({ fileUrl }: { fileUrl: string }) {
  const [loading, setLoading] = useState(true);

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
      
      <iframe
        src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
        className={`w-full h-full border-0 transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setLoading(false)}
        title="Vista previa del PDF interactiva"
      />
    </div>
  );
}
