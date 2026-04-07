import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { CloudUpload, Search, Download, FileText, File } from 'lucide-react';
import DotGrid from '@/components/DotGrid';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Permitimos ver la landing aunque estemos logeados

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">
        <div className="absolute inset-0 z-0">
          <DotGrid
            dotSize={5}
            gap={15}
            baseColor="#271E37"
            activeColor="#5227FF"
            proximity={120}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
          />
        </div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] dark:opacity-[0.05]"></div>
        <div className="max-w-5xl mx-auto text-center z-10 pt-20">
          <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary-container/10 dark:bg-blue-500/10 text-primary-container dark:text-blue-400 font-bold text-sm tracking-widest uppercase border border-primary-container/20 dark:border-blue-500/20 shadow-sm">El Hub de Conocimiento</span>
          <h1 className="font-headline text-5xl md:text-8xl font-extrabold text-[#1d3b6f] dark:text-white tracking-tighter mb-6 leading-[1.1]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1d3b6f] to-primary-container dark:from-blue-400 dark:to-blue-600">UCAHUB</span>
          </h1>
          <p className="font-headline text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
            Todos tus recursos universitarios en un solo lugar. La plataforma diseñada para la agilidad académica.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={user ? "/hub" : "/auth"} className="w-full sm:w-auto px-8 py-4 bg-[#1d3b6f] dark:bg-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-[0_20px_40px_-15px_rgba(29,59,111,0.4)] dark:hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.4)] transition-all active:scale-95 text-center flex items-center justify-center gap-2">
              {user ? "Ir a mi Biblioteca" : "Comenzar"}
            </Link>
            <Link href="#features" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 text-center shadow-sm">
              Explorar Funciones
            </Link>
          </div>
        </div>
        
        {/* Floating Decorative Elements */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#1d3b6f]/10 dark:bg-[#1d3b6f]/30 rounded-full blur-[100px] pointer-events-none"></div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-32 px-6 max-w-7xl mx-auto bg-white dark:bg-[#0f172a] transition-colors duration-300" id="features">
        <div className="mb-16 text-center md:text-left">
          <span className="text-primary-container dark:text-blue-400 font-bold tracking-widest uppercase text-sm">Potencia tu estudio</span>
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mt-3">Funciones diseñadas para ti</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Large Feature */}
          <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/50 p-10 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group overflow-hidden relative">
            <div className="max-w-md relative z-10">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
                <CloudUpload className="w-8 h-8 text-primary-container dark:text-blue-400" />
              </div>
              <h3 className="font-headline text-3xl font-bold text-slate-900 dark:text-white mb-4">Subir y Compartir</h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">Comparte tus apuntes, guías y resúmenes con la comunidad de forma instantánea. Digitaliza tu conocimiento.</p>
            </div>
            <div className="absolute -right-20 -bottom-20 w-96 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
               <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuByWPeUnUwrZCNu_Z4BywLAsd6PNj3OJn5H8bLbXkya8O1ZLG_7gFwOWfMDbRCvzymPzQavC2DyEn69FB0LRIioxbuOdOyAvaM7maKtDqZBFAZ_lPezjl-AoVOqzoN1AmGHyVUurZhUBH8NZ9UmfBC59hSoaFmMXNXBVPfOnkTmWzRKFhkObyb2SaUAUUoOnKtC4ug_rjzwZ2cbki7SHNP88E_TlAZM4DVcBT0w8l1HmNpKDphIsqe1zDGXlJNEWOYVpgRIkOmOr49k" alt="Abstract" className="rounded-2xl shadow-2xl skew-x-[-10deg] rotate-[10deg] blur-[2px] group-hover:blur-none transition-all" />
            </div>
          </div>
          
          {/* Vertical Feature */}
          <div className="bg-[#1d3b6f] dark:bg-blue-900 relative overflow-hidden text-white p-10 md:p-12 rounded-3xl flex flex-col justify-between shadow-xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md group-hover:scale-110 transition-transform">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-headline text-3xl font-bold mb-4">Búsqueda Inteligente</h3>
              <p className="text-blue-100 dark:text-blue-200 text-lg leading-relaxed">Encuentra exactamente lo que necesitas mediante filtros por materia, profesor o año al instante.</p>
            </div>
            <div className="pt-8 border-t border-white/10 mt-12 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-[#1d3b6f] bg-green-400 flex items-center justify-center font-bold text-green-900">1s</div>
                <p className="text-sm font-medium text-blue-100">Tiempo de respuesta</p>
              </div>
            </div>
          </div>
          
          {/* Small Feature */}
          <div className="md:col-span-3 bg-slate-50 dark:bg-slate-800/50 p-10 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-12 group">
            <div className="md:w-1/2">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
                <Download className="w-8 h-8 text-primary-container dark:text-blue-400" />
              </div>
              <h3 className="font-headline text-3xl font-bold text-slate-900 dark:text-white mb-4">Descargar y Offline</h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">Acceso a todos tus recursos guardados. Estudia en cualquier lugar, en cualquier momento sin depender del WiFi.</p>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-6 w-full">
              <div className="h-40 bg-white dark:bg-slate-900 rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-slate-100 dark:border-slate-800 hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 bg-red-50 dark:bg-red-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block mb-1">Matemática II.pdf</span>
                  <span className="text-xs text-slate-400">4.2 MB</span>
                </div>
              </div>
              <div className="h-40 bg-white dark:bg-slate-900 rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-slate-100 dark:border-slate-800 hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <File className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block mb-1">Apuntes_Final.docx</span>
                  <span className="text-xs text-slate-400">1.8 MB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800 transition-colors duration-300" id="how-it-works">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">Flujo de trabajo</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4 text-lg">De la duda al conocimiento en tres simples pasos</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-20 right-20 h-0.5 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent -z-10"></div>
            
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-8 border border-slate-200 dark:border-slate-700 group-hover:scale-110 transition-transform">
                <span className="text-3xl font-black text-[#1d3b6f] dark:text-blue-400">01</span>
              </div>
              <h4 className="font-headline text-2xl font-bold text-slate-900 dark:text-white mb-3">Únete a la Red</h4>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Regístrate en segundos y accede al portal de tu facultad.</p>
            </div>
            
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-2xl bg-[#1d3b6f] dark:bg-blue-600 text-white shadow-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <span className="text-3xl font-black">02</span>
              </div>
              <h4 className="font-headline text-2xl font-bold text-slate-900 dark:text-white mb-3">Intercambia</h4>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Sube tus mejores apuntes y aporta a la inteligencia colectiva.</p>
            </div>
            
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-8 border border-slate-200 dark:border-slate-700 group-hover:scale-110 transition-transform">
                <span className="text-3xl font-black text-[#1d3b6f] dark:text-blue-400">03</span>
              </div>
              <h4 className="font-headline text-2xl font-bold text-slate-900 dark:text-white mb-3">Estudia y Aprueba</h4>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Descarga lo que necesites para asegurar el 10 en tu final.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-white dark:bg-[#0f172a] transition-colors duration-300">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#1d3b6f] to-[#0a1f44] dark:from-blue-600 dark:to-blue-900 rounded-[2.5rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="font-headline text-4xl md:text-6xl font-black text-white mb-8 tracking-tight leading-tight">¿Listo para mejorar<br/>tus notas?</h2>
            <p className="text-blue-100 text-lg md:text-xl mb-12 max-w-2xl mx-auto opacity-90">Únete a miles de estudiantes que ya están transformando su forma de estudiar con UCAHUB de forma totalmente gratuita.</p>
            <Link href={user ? "/hub" : "/auth"} className="px-10 py-5 bg-white text-[#1d3b6f] rounded-2xl font-black text-lg hover:shadow-xl hover:scale-105 transition-all shadow-lg active:scale-95 inline-flex items-center gap-2">
              {user ? "Acceder al Hub Evaluativo" : "Crear cuenta gratuita ahora"}
            </Link>
          </div>
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-black/20 rounded-full blur-3xl"></div>
        </div>
      </section>
    </>
  );
}
