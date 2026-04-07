'use client'

import React, { useState } from 'react';
import { Pencil, Loader2, X, Save } from 'lucide-react';
import { updateFile } from '@/app/actions/file-actions';

interface EditFileModalProps {
  file: {
    id: string;
    title: string;
    description: string;
    subject: string;
    career: string;
    type: string;
    year: number;
  };
}

export function EditFileModal({ file }: EditFileModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: file.title,
    description: file.description || '',
    subject: file.subject,
    career: file.career,
    type: file.type,
    year: file.year
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await updateFile(file.id, formData);
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating file:', error);
      alert('Error al actualizar el archivo');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-3 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors shrink-0 border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
        title="Editar archivo"
      >
        <Pencil className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8 border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-[#1d3b6f] dark:text-white">Editar Recurso</h3>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                disabled={isSaving}
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Título del archivo</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1d3b6f] dark:focus:ring-blue-500 transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Materia</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1d3b6f] dark:focus:ring-blue-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Tipo de Documento</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1d3b6f] dark:focus:ring-blue-500 transition-all font-medium"
                  >
                    <option value="Apunte">Apunte</option>
                    <option value="Examen">Examen</option>
                    <option value="Trabajo Práctico">Trabajo Práctico</option>
                    <option value="Resumen">Resumen</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Descripción</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1d3b6f] dark:focus:ring-blue-500 transition-all font-medium resize-none"
                  placeholder="Describe brevemente el contenido..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isSaving}
                  className="flex-1 px-6 py-4 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-[2] bg-[#1d3b6f] dark:bg-blue-600 text-white rounded-xl font-bold px-6 py-4 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Guardando cambios...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
