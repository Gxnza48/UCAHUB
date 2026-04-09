import { createClient } from '@/utils/supabase/server';
import FileCard from '@/components/FileCard';
import HubFilters from '@/components/HubFilters';
import Link from 'next/link';
import { Search, SearchX, TrendingUp } from 'lucide-react';

export default async function HubPage(props: { searchParams: Promise<{ q?: string, carrera?: string, tipo?: string, materia?: string }> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  
  let query = supabase.from('files').select('*, users(username)').order('created_at', { ascending: false });
  
  if (searchParams.q) {
    query = query.ilike('title', `%${searchParams.q}%`);
  }
  if (searchParams.carrera) {
    query = query.eq('career', searchParams.carrera);
  }
  if (searchParams.tipo) {
    query = query.eq('type', searchParams.tipo);
  }
  if (searchParams.materia) {
    query = query.ilike('subject', `%${searchParams.materia}%`);
  }

  const { data: files, error } = await query;

  // Fetch trending resources
  const { data: trendingFiles } = await supabase
    .from('files')
    .select('*, users(username)')
    .order('download_count', { ascending: false })
    .limit(4);

  return (
    <div className="py-24 px-6 max-w-7xl mx-auto min-h-screen">
      <header className="mb-20">
        <div className="flex flex-col gap-8">
          <h1 className="font-headline font-bold text-5xl md:text-7xl text-text dark:text-white leading-[0.9] tracking-tighter">
            Biblioteca Académica <br/>
            <span className="text-gradient">Cooperativa</span>
          </h1>
          
          <form method="GET" action="/hub" className="relative w-full max-w-3xl group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-primary/40">
              <Search className="w-6 h-6" />
            </div>
            <input 
              name="q"
              defaultValue={searchParams.q || ''}
              className="w-full h-20 pl-16 pr-32 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-primary/10 rounded-2xl font-body text-xl focus:ring-4 focus:ring-primary/10 transition-all duration-500 outline-none text-text dark:text-slate-100 placeholder:text-slate-400 shadow-sm group-hover:shadow-xl group-hover:border-primary/20" 
              placeholder="Buscar por materia o título..." 
              type="text"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95 text-lg font-headline">
              Buscar
            </button>
          </form>
        </div>
      </header>

      {/* Trending Section - Only visible when not searching */}
      {!searchParams.q && !searchParams.carrera && !searchParams.tipo && trendingFiles && trendingFiles.length > 0 && (
        <section className="mb-24">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="font-headline text-3xl font-bold text-text dark:text-white flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-cta" />
              Recursos Tendencia
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-cta/20 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {trendingFiles.map((file: any) => (
              <FileCard key={`trending-${file.id}`} file={file} />
            ))}
          </div>
        </section>
      )}

      <div className="flex items-center gap-6 mb-12">
        <h2 className="font-headline text-3xl font-bold text-text dark:text-white">Explorar Todos</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-primary/10 to-transparent"></div>
      </div>

      <HubFilters searchParams={searchParams} />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {files && files.length > 0 ? (
          files.map((file: any) => (
            <FileCard key={file.id} file={file} />
          ))
        ) : (
          <div className="col-span-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-16 flex flex-col items-center justify-center text-center gap-6 bg-slate-50/50 dark:bg-slate-900/20 backdrop-blur-sm">
            <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <SearchX className="w-12 h-12 opacity-80" />
            </div>
            <div className="max-w-md">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">No se encontraron resultados</h3>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">Prueba relajando los filtros o sé el primero en subir un archivo a esta categoría.</p>
            </div>
            <Link href="/upload" className="mt-4 px-8 py-4 bg-primary-container dark:bg-blue-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-primary-container/20 hover:-translate-y-0.5 active:scale-95 transition-all">
              Subir mi primer recurso
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
