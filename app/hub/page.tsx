import { createClient } from '@/utils/supabase/server';
import FileCard from '@/components/FileCard';
import HubFilters from '@/components/HubFilters';
import Link from 'next/link';
import { Search, SearchX } from 'lucide-react';

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

  return (
    <div className="py-20 px-6 max-w-7xl mx-auto min-h-screen">
      <header className="mb-12">
        <div className="flex flex-col gap-6">
          <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-slate-900 dark:text-white leading-tight tracking-tight">
            Tu biblioteca académica <br/>
            <span className="text-primary-container dark:text-blue-400">optimizada y compartida.</span>
          </h1>
          
          <form method="GET" action="/hub" className="relative w-full max-w-3xl group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <input 
              name="q"
              defaultValue={searchParams.q || ''}
              className="w-full h-16 pl-14 pr-32 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl font-body text-lg focus:ring-2 focus:ring-primary-container/30 transition-all duration-300 shadow-sm group-hover:shadow-md outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400" 
              placeholder="Buscar resúmenes o exámenes..." 
              type="text"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary-container dark:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:opacity-90 transition-colors shadow-sm active:scale-95">
              Buscar
            </button>
          </form>
        </div>
      </header>

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
