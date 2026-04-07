import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ZoomIn, Printer, Maximize, FileText, File, Download } from 'lucide-react';
import { PdfPreview } from '@/components/PdfPreview';
import { DownloadButton } from '@/components/DownloadButton';
import { RatingSystem } from '@/components/RatingSystem';

export default async function FileDetail(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: file, error } = await supabase
    .from('files')
    .select('*, users(username, id)')
    .eq('id', params.id)
    .single();

  if (error || !file) {
    notFound();
  }

  // Fetch ratings for this file
  const { data: ratingsData } = await supabase
    .from('ratings')
    .select('rating, user_id')
    .eq('file_id', file.id);

  const totalRatings = ratingsData?.length || 0;
  const averageRating = totalRatings > 0 
    ? ratingsData!.reduce((acc: number, curr: any) => acc + curr.rating, 0) / totalRatings 
    : 0;
  
  const userRating = ratingsData?.find((r: any) => r.user_id === user?.id)?.rating || 0;

  // Use download attribute in native anchor if same-origin, or target="_blank"
  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <nav className="mb-8 flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <Link href="/hub" className="flex items-center gap-2 hover:text-[#1d3b6f] dark:hover:text-blue-400 transition-colors group">
          <ArrowLeft className="w-5 h-5 group-active:-translate-x-1 duration-200" />
          <span className="text-sm font-medium">Volver a la Biblioteca</span>
        </Link>
        <span className="mx-2 text-slate-300 dark:text-slate-600">/</span>
        <span className="text-sm text-slate-600 dark:text-slate-300">{file.career}</span>
        <span className="mx-2 text-slate-300 dark:text-slate-600">/</span>
        <span className="text-sm text-[#1d3b6f] dark:text-blue-400 font-semibold">{file.subject}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* File Preview Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-800/80 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 aspect-[3/4] relative group flex items-center justify-center p-6">
            <div className="w-full h-full bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden relative">
              <div className="h-10 bg-surface-container-high border-b border-outline-variant/20 flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                  <ZoomIn className="w-4 h-4 opacity-50" />
                  <span className="text-[10px] font-medium opacity-50">Documento PDF</span>
                </div>
                <div className="flex gap-2 text-slate-500">
                  <Printer className="w-4 h-4 opacity-50" />
                  <Maximize className="w-4 h-4 opacity-50" />
                </div>
              </div>
              <div className="flex-1 relative overflow-hidden bg-slate-100 dark:bg-slate-900 rounded-b-lg">
                 <PdfPreview fileUrl={file.file_url} />
              </div>
            </div>
            
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 flex items-center justify-center">
              <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="bg-white/90 backdrop-blur px-6 py-3 rounded-full flex items-center gap-3 shadow-lg text-primary font-semibold hover:scale-105 transition-transform">
                <ZoomIn className="w-5 h-5" />
                Ver Completo
              </a>
            </div>
          </div>
        </div>

        {/* Metadata & Actions Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-800/80 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
            <div>
              <h1 className="font-headline text-2xl font-bold text-[#1d3b6f] dark:text-white leading-tight mb-2">{file.title}</h1>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <File className="w-4 h-4" />
                <span className="text-sm font-medium">Documento {file.type}</span>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{file.description}</p>
            
            <div className="space-y-4">
              <DownloadButton fileId={file.id} fileUrl={file.file_url} />
            </div>

            <div className="pt-2">
              <RatingSystem 
                fileId={file.id} 
                userId={user?.id} 
                initialRating={userRating}
                averageRating={averageRating}
                totalRatings={totalRatings}
              />
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1d3b6f] dark:bg-blue-600 text-white flex items-center justify-center font-bold font-headline">
                    {file.users?.username ? file.users.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Subido por</p>
                    <p className="text-sm font-bold text-[#1d3b6f] dark:text-blue-400">{file.users?.username || 'Anónimo'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800/80 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-headline font-bold text-[#1d3b6f] dark:text-white">Información Adicional</h3>
            <dl className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <dt className="text-slate-400 dark:text-slate-500">Materia</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-200 text-right">{file.subject}</dd>
              </div>
              <div className="flex justify-between items-center text-sm">
                <dt className="text-slate-400 dark:text-slate-500">Carrera</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-200 text-right">{file.career}</dd>
              </div>
              <div className="flex justify-between items-center text-sm">
                <dt className="text-slate-400 dark:text-slate-500">Año de Carrera</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-200 text-right">{file.year}º Año</dd>
              </div>
              <div className="flex justify-between items-center text-sm">
                <dt className="text-slate-400 dark:text-slate-500">Fecha de Subida</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-200 text-right">{new Date(file.created_at).toLocaleDateString('es-AR')}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
