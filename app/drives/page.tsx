'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, HardDrive, ExternalLink, Loader2 } from 'lucide-react';

const DRIVE_FOLDERS = [
  { id: '1A1mVhKfkdJ2rN-18uZNLimAHhAwK_5KZ', rawUrl: 'https://drive.google.com/drive/folders/1A1mVhKfkdJ2rN-18uZNLimAHhAwK_5KZ' },
  { id: '1uu-RoLgM9V9FUTOqTZ7e-IGlJHNuM5QH', rawUrl: 'https://drive.google.com/drive/folders/1uu-RoLgM9V9FUTOqTZ7e-IGlJHNuM5QH' },
  { id: '1vGYWDHIvIGZt_cy0ptsaMO7Nn-YJcMO1', rawUrl: 'https://drive.google.com/drive/folders/1vGYWDHIvIGZt_cy0ptsaMO7Nn-YJcMO1' },
  { id: '15RMJO7lx1Z1gRut6wDD4KfQ4S7Vg6T9i', rawUrl: 'https://drive.google.com/drive/folders/15RMJO7lx1Z1gRut6wDD4KfQ4S7Vg6T9i' }
];

export default function DrivesPage() {
  const [activeDrive, setActiveDrive] = useState(DRIVE_FOLDERS[0]);
  const [driveTitles, setDriveTitles] = useState<Record<string, string>>({});
  const [titleLoading, setTitleLoading] = useState(true);

  useEffect(() => {
    const fetchTitles = async () => {
      setTitleLoading(true);
      const titles: Record<string, string> = {};
      
      for (const folder of DRIVE_FOLDERS) {
        try {
          const res = await fetch(`/api/drive-title?url=${encodeURIComponent(folder.rawUrl)}`);
          if (res.ok) {
            const data = await res.json();
            titles[folder.id] = data.title;
          } else {
            titles[folder.id] = 'Carpeta de Documentos';
          }
        } catch {
          titles[folder.id] = 'Carpeta de Documentos';
        }
      }
      setDriveTitles(titles);
      setTitleLoading(false);
    };

    fetchTitles();
  }, []);

  return (
    <div className="pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto min-h-screen">
      <nav className="mb-12 flex items-center gap-2 text-slate-500 font-headline uppercase tracking-widest text-[10px] sm:text-xs font-black">
        <Link href="/hub" className="flex items-center gap-2 hover:text-primary transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 duration-300" />
          <span>Biblioteca</span>
        </Link>
        <span className="mx-2 opacity-30">/</span>
        <span className="text-primary truncate">Drives Comunitarios</span>
      </nav>

      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 tracking-tight">Drives Acumulativos</h1>
        <p className="text-slate-500 font-body text-lg max-w-2xl">Explorá las carpetas gigantes aportadas por la comunidad. Podés abrirlas aquí o ir directamente a Google Drive para guardarlas en tu cuenta.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Selector */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-bold font-headline text-lg mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">Directorios</h3>
          
          <div className="flex flex-col gap-3">
            {DRIVE_FOLDERS.map((folder, index) => {
              const isActive = activeDrive.id === folder.id;
              const title = driveTitles[folder.id] || `Drive Folder ${index + 1}`;
              
              return (
                <button
                  key={folder.id}
                  onClick={() => setActiveDrive(folder)}
                  className={`text-left w-full relative p-4 rounded-2xl transition-all duration-300 border ${
                    isActive 
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]' 
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl shrink-0 ${isActive ? 'bg-white/20' : 'bg-primary/5 text-primary'}`}>
                      <HardDrive className="w-5 h-5" />
                    </div>
                    <div className="flex-1 truncate">
                      {titleLoading ? (
                        <div className={`h-4 rounded animate-pulse w-3/4 ${isActive ? 'bg-white/30' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                      ) : (
                        <p className="font-bold font-headline truncate text-sm">{title}</p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Iframe Area */}
        <div className="lg:col-span-3">
          <div className="liquid-glass rounded-3xl overflow-hidden shadow-2xl border-primary/5 h-[600px] md:h-[800px] flex flex-col relative group">
             {/* Header Toolbar */}
             <div className="h-16 bg-slate-50 dark:bg-slate-900 border-b border-black/5 flex items-center justify-between px-6 shrink-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {titleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <HardDrive className="w-5 h-5" />}
                  </div>
                  <div>
                    <h2 className="font-bold font-headline text-sm md:text-md truncate max-w-[200px] md:max-w-md">
                      {titleLoading ? 'Cargando directorio...' : driveTitles[activeDrive.id] || 'Google Drive'}
                    </h2>
                  </div>
                </div>
                <div>
                  <a 
                    href={activeDrive.rawUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:bg-primary/5 px-4 py-2 rounded-xl transition-colors font-bold text-xs md:text-sm uppercase tracking-wider"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="hidden sm:inline">Abrir en Drive</span>
                  </a>
                </div>
             </div>

             {/* Iframe Wrapper */}
             <div className="flex-1 relative bg-white dark:bg-[#131314]">
                <iframe 
                  src={`https://drive.google.com/embeddedfolderview?id=${activeDrive.id}#grid`} 
                  className="absolute inset-0 w-full h-full border-0"
                  allow="autoplay"
                ></iframe>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
