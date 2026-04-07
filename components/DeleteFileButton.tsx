'use client'

import React, { useState } from 'react';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { deleteFile } from '@/app/actions/file-actions';

interface DeleteFileButtonProps {
  fileId: string;
  fileUrl: string;
  fileName: string;
}

export function DeleteFileButton({ fileId, fileUrl, fileName }: DeleteFileButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteFile(fileId, fileUrl);
      setShowConfirm(false);
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error al eliminar el archivo');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors shrink-0 border border-transparent hover:border-red-100 dark:hover:border-red-500/20"
        title="Eliminar archivo"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-4 text-red-500 mb-6 font-bold text-xl">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3>Confirmar eliminación</h3>
            </div>
            
            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              ¿Estás seguro de que quieres eliminar <span className="font-bold text-slate-900 dark:text-white">"{fileName}"</span>? 
              Esta acción no se puede deshacer y el archivo se borrará permanentemente de la plataforma.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="px-6 py-3 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-8 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  'Eliminar Permanentemente'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
