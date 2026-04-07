'use client'

import React, { useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { FileUp, FileCheck, Info, Loader2 } from 'lucide-react';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [career, setCareer] = useState('');
  const [year, setYear] = useState('');
  const [subject, setSubject] = useState('');
  const [type, setType] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor sube un archivo pdf primero.');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado.');

      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop() || 'pdf';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from('files').upload(filePath, file);
      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage.from('files').getPublicUrl(filePath);

      // 3. Insert into Database
      const { error: dbError } = await supabase.from('files').insert({
        title,
        description,
        file_url: publicUrl,
        type,
        career,
        year: parseInt(year) || null,
        subject,
        user_id: user.id
      });

      if (dbError) throw dbError;

      // Navigate to Dashboard
      router.push('/hub');
      router.refresh();
      
    } catch (err: any) {
      setError(err.message || 'Error al subir el archivo');
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
      {/* Left Side: File Upload */}
      <div className="lg:col-span-5 order-1 lg:order-2">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] lg:sticky top-28">
          <h3 className="font-headline text-2xl font-bold text-slate-900 dark:text-white mb-6">Archivo del Documento</h3>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`relative group cursor-pointer border-2 border-dashed ${file ? 'border-primary-container bg-primary-container/5 dark:border-blue-500 dark:bg-blue-500/10' : 'border-slate-300 dark:border-slate-700 hover:border-primary-container dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-800/50'} transition-all duration-300 rounded-2xl p-10 flex flex-col items-center justify-center text-center`}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden" 
            />
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-transform duration-300 ${file ? 'bg-primary-container dark:bg-blue-600 text-white scale-110 shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:scale-110 group-hover:text-primary-container dark:group-hover:text-blue-400 group-hover:bg-primary-container/10 dark:group-hover:bg-blue-500/20'}`}>
              {file ? <FileCheck className="w-10 h-10" /> : <FileUp className="w-10 h-10" />}
            </div>
            {file ? (
              <>
                <p className="font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{file.name}</p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="mt-6 text-xs font-bold text-red-500 dark:text-red-400 hover:underline px-4 py-2 bg-red-50 dark:bg-red-500/10 rounded-full">Cambiar archivo</button>
              </>
            ) : (
              <>
                <p className="font-bold text-slate-800 dark:text-slate-200 mb-1 text-lg">Carga tu PDF aquí</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">o haz clic para buscar en tus archivos</p>
                <p className="mt-6 text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md">Solo PDF (Máx. 25MB)</p>
              </>
            )}
          </div>
          
          {error && (
            <div className="mt-8 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-500/20 shadow-sm flex items-start gap-3">
              <Info className="w-5 h-5 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}
          
          <div className="mt-8 relative overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-400 dark:bg-blue-500"></div>
            <div className="p-5 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium">Por favor, asegúrate de que el documento no contenga información personal sensible de profesores sin su autorización previa.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Metadata Form */}
      <div className="lg:col-span-7 order-2 lg:order-1 space-y-6">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
          <form id="upload-form" onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 px-1">Título del Documento</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} type="text" className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-container/20 dark:focus:border-blue-500/30 rounded-2xl p-4 focus:ring-4 focus:ring-primary-container/5 dark:focus:ring-blue-500/10 transition-all text-slate-900 dark:text-white outline-none placeholder:text-slate-400 font-medium" placeholder="Ej: Resumen Primer Parcial - Álgebra I" />
              </div>
              
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 px-1">Descripción</label>
                <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-container/20 dark:focus:border-blue-500/30 rounded-2xl p-4 focus:ring-4 focus:ring-primary-container/5 dark:focus:ring-blue-500/10 transition-all text-slate-900 dark:text-white outline-none placeholder:text-slate-400 font-medium resize-none shadow-sm" placeholder="Contanos de qué trata este material..." />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 px-1">Carrera</label>
                <select required value={career} onChange={e => setCareer(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-container/20 dark:focus:border-blue-500/30 rounded-2xl p-4 focus:ring-4 focus:ring-primary-container/5 dark:focus:ring-blue-500/10 transition-all outline-none appearance-none font-medium cursor-pointer text-slate-900 dark:text-white">
                  <option disabled value="">Seleccionar carrera</option>
                  <option value="Abogacía">Abogacía</option>
                  <option value="Contador Público">Contador Público</option>
                  <option value="Administración de Empresas">Administración de Empresas</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                  <option value="Ingeniería Química">Ingeniería Química</option>
                  <option value="Comunicación Periodística">Comunicación Periodística</option>
                  <option value="Ciencia de Datos">Ciencia de Datos</option>
                </select>
              </div>
              
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 px-1">Año de la Carrera</label>
                <select required value={year} onChange={e => setYear(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-container/20 dark:focus:border-blue-500/30 rounded-2xl p-4 focus:ring-4 focus:ring-primary-container/5 dark:focus:ring-blue-500/10 transition-all outline-none appearance-none font-medium cursor-pointer text-slate-900 dark:text-white">
                  <option disabled value="">Seleccionar año</option>
                  <option value="1">1er Año</option>
                  <option value="2">2do Año</option>
                  <option value="3">3er Año</option>
                  <option value="4">4to Año</option>
                  <option value="5">5to Año</option>
                </select>
              </div>
              
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 px-1">Materia</label>
                <input required value={subject} onChange={e => setSubject(e.target.value)} type="text" className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-container/20 dark:focus:border-blue-500/30 rounded-2xl p-4 focus:ring-4 focus:ring-primary-container/5 dark:focus:ring-blue-500/10 transition-all text-slate-900 dark:text-white outline-none placeholder:text-slate-400 font-medium" placeholder="Ej: Análisis Matemático I" />
              </div>
              
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 px-1">Tipo de Contenido</label>
                <select required value={type} onChange={e => setType(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-container/20 dark:focus:border-blue-500/30 rounded-2xl p-4 focus:ring-4 focus:ring-primary-container/5 dark:focus:ring-blue-500/10 transition-all outline-none appearance-none font-medium cursor-pointer text-slate-900 dark:text-white">
                  <option disabled value="">Seleccionar tipo</option>
                  <option value="Apunte">Apunte</option>
                  <option value="Resumen">Resumen</option>
                  <option value="Examen Anterior">Examen Anterior</option>
                  <option value="Guía de TPs">Guía de TPs</option>
                </select>
              </div>
            </div>

            <div className="pt-10">
              <button 
                disabled={loading || !file} 
                type="submit" 
                className="w-full sm:w-auto bg-[#1d3b6f] dark:bg-blue-600 text-white font-headline font-bold py-4 px-12 rounded-2xl flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-[#1d3b6f]/20 dark:hover:shadow-blue-900/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 shadow-lg"
              >
                <span className="flex items-center gap-3 font-bold text-lg">
                  {loading && <Loader2 className="w-6 h-6 animate-spin" />}
                  <span>{loading ? 'Subiendo archivo...' : 'Publicar Documento'}</span>
                </span>
              </button>
              <p className="mt-6 text-xs font-medium text-slate-400 dark:text-slate-500 text-center sm:text-left px-2">Al subir el archivo, confirmas que tienes los derechos sobre el material o es de dominio público.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
