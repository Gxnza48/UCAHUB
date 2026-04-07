import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Calendar, FileText, Upload, Star } from 'lucide-react';
import { EditUsername } from '@/components/EditUsername';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null; // Middleware handles redirection

  const { data: userFiles } = await supabase
    .from('files')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const { data: dbUser } = await supabase
    .from('users')
    .select('username')
    .eq('id', user.id)
    .single();

  const username = dbUser?.username || user.email?.split('@')[0] || '';

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      <header className="relative mb-12">
        <div className="h-48 md:h-64 rounded-2xl overflow-hidden mb-[-4rem] z-0 shadow-lg">
          <div className="w-full h-full bg-gradient-to-br from-[#1d3b6f] to-[#001736] dark:from-slate-800 dark:to-slate-900 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
          </div>
        </div>
        
        <div className="relative z-10 px-6 md:px-12 flex flex-col md:flex-row items-end gap-6">
          <div className="p-[3px] bg-white dark:bg-slate-900 rounded-full shadow-xl">
             <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center border-4 border-white dark:border-slate-900 text-primary-container dark:text-blue-400 font-headline font-bold text-6xl lowercase">
               {user.email?.charAt(0)}
             </div>
          </div>
          
          <div className="flex-1 pb-4 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
              <EditUsername initialUsername={username} userId={user.id} />
              <span className="bg-primary-container/10 dark:bg-blue-500/10 text-primary-container dark:text-blue-400 border border-primary-container/20 dark:border-blue-500/20 text-xs font-bold px-3 py-1 rounded-full w-fit mx-auto md:mx-0 tracking-widest uppercase mt-1 md:mt-0">
                Miembro Académico
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium mb-4 max-w-2xl text-lg leading-relaxed">
               Bienvenido a tu cuartel general. Administra los recursos que aportas a la comunidad.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <Calendar className="w-4 h-4 text-primary-container dark:text-blue-400" />
                Miembro desde {new Date(user.created_at).getFullYear()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between group hover:border-primary-container/50 dark:hover:border-blue-500/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Tus Archivos</span>
            <div className="w-10 h-10 bg-primary-container/10 dark:bg-blue-500/10 rounded-full flex items-center justify-center text-primary-container dark:text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-5xl font-black text-slate-900 dark:text-white group-hover:text-primary-container dark:group-hover:text-blue-400 transition-colors">{userFiles?.length || 0}</span>
            <p className="text-sm text-slate-500 mt-2 font-medium">Recursos subidos</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between opacity-60">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Descargas</span>
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700/50 rounded-full flex items-center justify-center text-slate-400">
              <Upload className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-5xl font-black text-slate-300 dark:text-slate-600">-</span>
            <p className="text-sm text-slate-400 mt-2 font-medium">Próximamente</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between opacity-60">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Reputación</span>
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center text-amber-500">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-5xl font-black text-slate-300 dark:text-slate-600">-</span>
            <p className="text-sm text-slate-400 mt-2 font-medium">Próximamente</p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-8 border-b border-slate-200 dark:border-slate-800 mb-8 px-2">
          <h2 className="pb-4 text-slate-900 dark:text-white font-bold border-b-2 border-primary-container dark:border-blue-500 text-xl">Material Aportado</h2>
        </div>

        <div className="space-y-4">
          {userFiles && userFiles.length > 0 ? (
            userFiles.map((file: any) => (
              <div key={file.id} className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-primary-container/50 dark:hover:border-blue-400/50 hover:shadow-lg hover:-translate-y-0.5 group">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 shrink-0 shadow-sm border border-red-100 dark:border-red-500/20">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-primary-container dark:text-blue-400 mb-1 block">{file.career}</span>
                    <Link href={`/file/${file.id}`} className="block">
                      <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100 group-hover:text-primary-container dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-2">{file.title}</h3>
                    </Link>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-600 dark:text-slate-300">{file.type}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">{new Date(file.created_at).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric'})}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto justify-end mt-2 sm:mt-0">
                   <Link href={`/file/${file.id}`} className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary-container hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-sm active:scale-95">
                     Inspeccionar
                   </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-24 px-4 bg-slate-50/50 dark:bg-slate-900/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <div className="w-24 h-24 bg-white dark:bg-slate-800 shadow-sm rounded-full flex items-center justify-center mb-8 border border-slate-100 dark:border-slate-700">
                <Upload className="w-10 h-10 text-primary-container/40 dark:text-blue-500/40" />
              </div>
              <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">Tu biblioteca está vacía</h4>
              <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-8 text-lg">Comparte tus mejores apuntes con la comunidad y comienza a construir tu reputación académica hoy mismo.</p>
              <Link href="/upload" className="bg-primary-container dark:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all text-lg flex items-center gap-3">
                <Upload className="w-5 h-5" />
                Subir documento
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
