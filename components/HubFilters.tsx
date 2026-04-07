'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, FileText, FilterX } from 'lucide-react';

export default function HubFilters({ searchParams }: { searchParams: { q?: string, carrera?: string, tipo?: string, materia?: string } }) {
  const router = useRouter();

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newSearchParams = new URLSearchParams(window.location.search);
    if (value) {
      newSearchParams.set(name, value);
    } else {
      newSearchParams.delete(name);
    }
    router.push(`/hub?${newSearchParams.toString()}`);
  };

  return (
    <div className="mb-12">
      <form method="GET" action="/hub" className="flex flex-wrap items-center gap-4 w-full">
        {searchParams.q && <input type="hidden" name="q" value={searchParams.q} />}
        
        <div className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-800/80 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 focus-within:ring-2 ring-primary-container/20 dark:ring-blue-500/20 transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600">
          <GraduationCap className="w-5 h-5 text-primary-container dark:text-blue-400" />
          <select name="carrera" defaultValue={searchParams.carrera || ''} onChange={handleSelectChange} className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 dark:text-slate-200 min-w-[140px] outline-none cursor-pointer appearance-none">
            <option value="" className="text-slate-900">Todas las Carreras</option>
            <option value="Ingeniería Informática" className="text-slate-900">Ingeniería Informática</option>
            <option value="Administración de Empresas" className="text-slate-900">Administración de Empresas</option>
            <option value="Psicología" className="text-slate-900">Psicología</option>
            <option value="Derecho" className="text-slate-900">Derecho</option>
          </select>
        </div>

        <div className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-800/80 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 focus-within:ring-2 ring-primary-container/20 dark:ring-blue-500/20 transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600">
          <FileText className="w-5 h-5 text-primary-container dark:text-blue-400" />
          <select name="tipo" defaultValue={searchParams.tipo || ''} onChange={handleSelectChange} className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 dark:text-slate-200 min-w-[140px] outline-none cursor-pointer appearance-none">
            <option value="" className="text-slate-900">Todos los Tipos</option>
            <option value="Resumen" className="text-slate-900">Resumen</option>
            <option value="Examen Anterior" className="text-slate-900">Examen Anterior</option>
            <option value="Guía de TPs" className="text-slate-900">Guía de TPs</option>
            <option value="Apunte" className="text-slate-900">Apunte</option>
          </select>
        </div>

        {(searchParams.q || searchParams.carrera || searchParams.tipo || searchParams.materia) && (
          <Link href="/hub" className="ml-auto text-red-500 dark:text-red-400 text-sm font-bold flex items-center gap-1.5 hover:underline transition-colors bg-red-50 dark:bg-red-500/10 px-4 py-2 rounded-xl">
            <FilterX className="w-4 h-4" />
            Limpiar filtros
          </Link>
        )}
      </form>
    </div>
  );
}
