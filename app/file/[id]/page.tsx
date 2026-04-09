import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ZoomIn, Printer, Maximize, FileText, File, Download, Bookmark, Clock, Calendar } from 'lucide-react';
import { PdfPreview } from '@/components/PdfPreview';
import { DownloadButton } from '@/components/DownloadButton';
import { RatingSystem } from '@/components/RatingSystem';
import { BookmarkButton } from '@/components/BookmarkButton';

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

  // Check if bookmarked
  let isBookmarked = false;
  if (user) {
    const { data: bookmarkData } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq('file_id', file.id)
      .single();
    isBookmarked = !!bookmarkData;
  }

  // Use download attribute in native anchor if same-origin, or target="_blank"
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <nav className="mb-12 flex items-center gap-2 text-slate-500 font-headline uppercase tracking-widest text-[10px] font-black">
        <Link href="/hub" className="flex items-center gap-2 hover:text-primary transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 duration-300" />
          <span>Biblioteca</span>
        </Link>
        <span className="mx-2 opacity-30">/</span>
        <span className="opacity-60">{file.career}</span>
        <span className="mx-2 opacity-30">/</span>
        <span className="text-primary">{file.subject}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* File Preview Area */}
        <div className="lg:col-span-8 space-y-8">
          <div className="liquid-glass rounded-3xl overflow-hidden shadow-2xl border-primary/5 aspect-[3/4] relative group flex items-center justify-center p-1 md:p-4">
            <div className="w-full h-full bg-white rounded-2xl shadow-inner flex flex-col overflow-hidden relative border border-black/5">
              <div className="h-12 bg-slate-50 border-b border-black/5 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
                <div className="flex gap-4 text-slate-400">
                  <Printer className="w-4 h-4 opacity-50 hover:opacity-100 cursor-pointer transition-opacity" />
                  <Maximize className="w-4 h-4 opacity-50 hover:opacity-100 cursor-pointer transition-opacity" />
                </div>
              </div>
              <div className="flex-1 relative overflow-hidden bg-slate-100 dark:bg-slate-900">
                 <PdfPreview fileUrl={file.file_url} />
              </div>
            </div>
            
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 flex items-center justify-center">
              <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="btn-premium bg-white/90 backdrop-blur px-8 py-4 flex items-center gap-4 shadow-2xl text-primary font-black uppercase tracking-widest text-xs pointer-events-auto">
                <ZoomIn className="w-5 h-5" />
                Maximizar Lectura
              </a>
            </div>
          </div>
        </div>

        {/* Metadata & Actions Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="card-premium !p-8 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 liquid-glass rounded-lg text-[10px] font-black uppercase text-cta tracking-widest border-cta/20">{file.type}</span>
                <span className="text-[10px] font-black uppercase text-primary tracking-widest opacity-60">{file.career}</span>
              </div>
              <h1 className="font-headline text-4xl font-bold text-text dark:text-white leading-tight mb-4 tracking-tighter">{file.title}</h1>
              <p className="text-slate-600 dark:text-slate-400 font-body text-lg leading-relaxed italic border-l-2 border-primary/20 pl-4 py-1">{file.description}</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <DownloadButton fileId={file.id} fileUrl={file.file_url} />
              <BookmarkButton fileId={file.id} userId={user?.id} initialIsBookmarked={!!isBookmarked} />
            </div>
            
            <RatingSystem 
              fileId={file.id} 
              userId={user?.id} 
              initialRating={userRating}
              averageRating={averageRating}
              totalRatings={totalRatings}
            />

            <div className="pt-8 border-t border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl liquid-glass flex items-center justify-center text-primary font-bold text-xl font-headline border-primary/20 shadow-lg">
                  {file.users?.username ? file.users.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Aportador Académico</p>
                  <p className="text-lg font-bold text-text dark:text-white font-headline">{file.users?.username || 'Estudiante Anónimo'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card-premium !p-8 space-y-6">
            <h3 className="font-headline font-bold text-2xl text-text dark:text-white border-b border-primary/10 pb-4">Detalles del Recurso</h3>
            <dl className="grid gap-6">
              <div className="flex flex-col">
                <dt className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60 mb-1">Materia</dt>
                <dd className="font-bold text-text dark:text-slate-200 text-lg font-headline">{file.subject}</dd>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <dt className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60 mb-1">Año</dt>
                  <dd className="font-bold text-text dark:text-slate-200">{file.year}º Año</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60 mb-1">Fecha</dt>
                  <dd className="font-bold text-text dark:text-slate-200">{new Date(file.created_at).toLocaleDateString('es-AR')}</dd>
                </div>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
