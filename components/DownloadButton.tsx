'use client'

import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { incrementDownloadCount } from '@/app/actions/file-actions';

interface DownloadButtonProps {
  fileId: string;
  fileUrl: string;
}

export function DownloadButton({ fileId, fileUrl }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // Increment the count on the server
      await incrementDownloadCount(fileId);
      
      // Navigate to the file for download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.target = '_blank';
      link.download = '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error recording download:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button 
      onClick={handleDownload}
      disabled={isDownloading}
      className="w-full bg-[#1d3b6f] dark:bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all shadow-md disabled:opacity-70"
    >
      {isDownloading ? (
        <>
          <Loader2 className="w-6 h-6 animate-spin" />
          Preparando...
        </>
      ) : (
        <>
          <Download className="w-6 h-6" />
          Descargar ahora
        </>
      )}
    </button>
  );
}
