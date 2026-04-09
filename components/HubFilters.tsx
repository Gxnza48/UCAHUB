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
        
        <div className="flex items-center gap-2 px-5 py-3 liquid-glass rounded-2xl border-primary/10 transition-all hover:bg-white/60 dark:hover:bg-slate-800/60 shadow-sm">
          <GraduationCap className="w-5 h-5 text-primary" />
          <select name="carrera" defaultValue={searchParams.carrera || ''} onChange={handleSelectChange} className="bg-transparent border-none focus:ring-0 text-sm font-bold text-text dark:text-slate-200 min-w-[160px] outline-none cursor-pointer appearance-none font-headline">
            <option value="" className="text-slate-900">Todas las Carreras</option>
            <option value="Abogacía" className="text-slate-900">Abogacía</option>
            <option value="Contador Público" className="text-slate-900">Contador Público</option>
            <option value="Administración de Empresas" className="text-slate-900">Administración de Empresas</option>
            <option value="Marketing" className="text-slate-900">Marketing</option>
            <option value="Recursos Humanos" className="text-slate-900">Recursos Humanos</option>
            <option value="Ingeniería Industrial" className="text-slate-900">Ingeniería Industrial</option>
            <option value="Ingeniería Química" className="text-slate-900">Ingeniería Química</option>
            <option value="Comunicación Periodística" className="text-slate-900">Comunicación Periodística</option>
            <option value="Ciencia de Datos" className="text-slate-900">Ciencia de Datos</option>
          </select>
        </div>

        <div className="flex items-center gap-2 px-5 py-3 liquid-glass rounded-2xl border-primary/10 transition-all hover:bg-white/60 dark:hover:bg-slate-800/60 shadow-sm">
          <FileText className="w-5 h-5 text-primary" />
          <select name="tipo" defaultValue={searchParams.tipo || ''} onChange={handleSelectChange} className="bg-transparent border-none focus:ring-0 text-sm font-bold text-text dark:text-slate-200 min-w-[160px] outline-none cursor-pointer appearance-none font-headline">
            <option value="" className="text-slate-900">Todos los Tipos</option>
            <option value="Resumen" className="text-slate-900">Resumen</option>
            <option value="Examen Anterior" className="text-slate-900">Examen Anterior</option>
            <option value="Guía de TPs" className="text-slate-900">Guía de TPs</option>
            <option value="Apunte" className="text-slate-900">Apunte</option>
          </select>
        </div>

        {(searchParams.q || searchParams.carrera || searchParams.tipo || searchParams.materia) && (
          <Link href="/hub" className="ml-auto text-cta text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-all bg-cta/5 px-5 py-3 rounded-2xl border border-cta/10">
            <FilterX className="w-4 h-4" />
            Limpiar filtros
          </Link>
        )}
      </form>
    </div>
  );
}
