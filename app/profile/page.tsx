import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Calendar, FileText, Upload, Star, Maximize } from 'lucide-react';
import { EditUsername } from '@/components/EditUsername';
import { EditFileModal } from '@/components/EditFileModal';
import { DeleteFileButton } from '@/components/DeleteFileButton';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null; // Middleware handles redirection

  const { data: userFiles } = await supabase
    .from('files')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const totalDownloads = userFiles?.reduce((acc, file) => acc + (file.download_count || 0), 0) || 0;
  const reputation = ((userFiles?.length || 0) * 10) + (totalDownloads * 2);

  const { data: dbUser } = await supabase
    .from('users')
    .select('username')
    .eq('id', user.id)
    .single();

  const username = dbUser?.username || user.email?.split('@')[0] || '';

  // Fetch bookmarks
  const { data: bookmarkedFiles } = await supabase
    .from('bookmarks')
    .select('*, files(*, users(username))')
    .eq('user_id', user.id);

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      {/* ... header and stats ... (omitted for brevity in replacement, but I must keep them) */}
      <header className="relative mb-20">
        <div className="h-64 rounded-[2rem] overflow-hidden mb-[-5rem] z-0 shadow-2xl relative">
          <div className="w-full h-full bg-gradient-to-br from-primary to-indigo-900 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1)_0%,_transparent_70%)]"></div>
          </div>
        </div>
        
        <div className="relative z-10 px-8 flex flex-col md:flex-row items-end gap-10">
          <div className="p-1.5 bg-white/20 backdrop-blur-3xl rounded-[3rem] shadow-2xl">
             <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2.8rem] bg-white dark:bg-slate-800 flex flex-col items-center justify-center border-8 border-white dark:border-slate-900 text-primary font-headline font-bold text-7xl shadow-inner">
               {user.email?.charAt(0).toUpperCase()}
             </div>
          </div>
          
          <div className="flex-1 pb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div className="font-headline">
                <EditUsername initialUsername={username} userId={user.id} />
              </div>
              <span className="liquid-glass text-primary dark:text-white px-4 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase border-primary/20 shadow-sm">
                Miembro Académico
              </span>
            </div>
            <p className="font-body text-xl text-slate-600 dark:text-slate-300 max-w-xl mb-6 leading-relaxed italic opacity-80">
               "Gestionando mi legado de conocimiento compartido en la comunidad UCA."
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                <Calendar className="w-4 h-4 text-primary" />
                Diciembre {new Date(user.created_at).getFullYear()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
        <div className="card-premium flex flex-col justify-between group overflow-hidden relative min-h-[160px]">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4 block">Aportes</span>
            <div className="w-10 h-10 liquid-glass rounded-xl flex items-center justify-center text-primary border-primary/10">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-5xl font-black text-text dark:text-white group-hover:text-primary transition-colors font-headline tracking-tighter">{userFiles?.length || 0}</span>
            <p className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-tight">Archivos compartidos</p>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
        </div>
        
        <div className="card-premium flex flex-col justify-between group overflow-hidden relative min-h-[160px]">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4 block">Impacto</span>
            <div className="w-10 h-10 liquid-glass rounded-xl flex items-center justify-center text-primary border-primary/10">
              <Upload className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-5xl font-black text-text dark:text-white group-hover:text-primary transition-colors font-headline tracking-tighter">{totalDownloads}</span>
            <p className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-tight">Lecturas totales</p>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
        </div>
        
        <div className="card-premium md:col-span-2 flex flex-col justify-between group overflow-hidden relative min-h-[160px] bg-primary text-white border-transparent">
          <div className="flex justify-between items-start relative z-10">
            <span className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-4 block">Prestigio Académico</span>
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
              <Star className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="relative z-10">
            <span className="text-6xl font-black text-white group-hover:text-cta transition-colors font-headline tracking-tighter">{reputation}</span>
            <p className="text-xs text-indigo-100 mt-2 font-bold uppercase tracking-tight">Reputación Total (Scholar Points)</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        </div>
      </section>

      {/* Badges Section */}
      <section className="mb-20">
        <div className="flex items-center gap-6 mb-12">
            <h2 className="font-headline text-3xl font-bold text-text dark:text-white">Insignias de Honor</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className={`card-premium !p-6 flex flex-col items-center text-center transition-all ${reputation >= 10 ? 'opacity-100 grayscale-0 ring-2 ring-primary/20' : 'opacity-40 grayscale'}`}>
                <div className="w-16 h-16 liquid-glass rounded-2xl flex items-center justify-center text-primary mb-4 border-primary/20">
                    <span className="text-2xl">🌱</span>
                </div>
                <h4 className="font-headline font-bold text-sm mb-1">Iniciante</h4>
                <p className="text-[10px] uppercase font-bold text-slate-400">Primer Aporte</p>
            </div>
            <div className={`card-premium !p-6 flex flex-col items-center text-center transition-all ${reputation >= 100 ? 'opacity-100 grayscale-0 ring-2 ring-cta/20' : 'opacity-40 grayscale'}`}>
                <div className="w-16 h-16 liquid-glass rounded-2xl flex items-center justify-center text-cta mb-4 border-cta/20">
                    <span className="text-2xl">🎓</span>
                </div>
                <h4 className="font-headline font-bold text-sm mb-1">Escriba</h4>
                <p className="text-[10px] uppercase font-bold text-slate-400">100 Scholar Points</p>
            </div>
            <div className={`card-premium !p-6 flex flex-col items-center text-center transition-all ${reputation >= 500 ? 'opacity-100 grayscale-0 ring-2 shadow-xl' : 'opacity-40 grayscale'}`}>
                <div className="w-16 h-16 liquid-glass rounded-2xl flex items-center justify-center mb-4 border-primary/20">
                    <span className="text-2xl">📜</span>
                </div>
                <h4 className="font-headline font-bold text-sm mb-1">Maestro</h4>
                <p className="text-[10px] uppercase font-bold text-slate-400">500 Scholar Points</p>
            </div>
        </div>
      </section>

      <section className="mb-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-headline text-3xl font-bold text-text dark:text-white">Gestión de Archivos</h2>
          <Link href="/upload" className="btn-premium bg-primary text-white text-xs px-6 py-3">Nuevos Recursos</Link>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {userFiles && userFiles.length > 0 ? (
            userFiles.map((file: any) => (
              <div key={file.id} className="card-premium !p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group hover:shadow-2xl transition-all border-primary/5">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 rounded-2xl liquid-glass flex items-center justify-center text-primary shrink-0 transition-transform group-hover:rotate-6 border-primary/20">
                    <FileText className="w-10 h-10 opacity-40" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black tracking-widest uppercase text-cta mb-2 block">{file.career}</span>
                    <Link href={`/file/${file.id}`} className="block">
                      <h3 className="font-headline font-bold text-2xl text-text dark:text-white group-hover:text-primary transition-colors line-clamp-1 mb-2">{file.title}</h3>
                    </Link>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 liquid-glass rounded text-primary border-primary/10">{file.type}</span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{file.download_count || 0}</span>
                      </div>
                      <span className="text-xs text-slate-300 font-medium">|</span>
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter">{new Date(file.created_at).toLocaleDateString('es-AR', { month: 'short', day: 'numeric'})}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0 pt-6 sm:pt-0 border-t sm:border-none border-primary/5">
                   <EditFileModal file={file} />
                   <DeleteFileButton fileId={file.id} fileUrl={file.file_url} fileName={file.title} />
                   <Link href={`/file/${file.id}`} className="btn-premium liquid-glass text-xs font-black uppercase tracking-widest text-primary border-primary/20 px-6 py-3">
                     Revisar
                   </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="card-premium !p-20 text-center flex flex-col items-center border-dashed border-2 border-primary/10">
              <div className="w-28 h-28 liquid-glass rounded-[2rem] flex items-center justify-center mb-10 border-primary/10">
                <Upload className="w-12 h-12 text-primary/40" />
              </div>
              <h4 className="font-headline text-3xl font-bold text-text dark:text-white mb-4">Aún no has compartido recursos</h4>
              <p className="font-body text-lg text-slate-500 max-w-md mx-auto mb-12 italic">"El conocimiento solo crece cuando se comparte. Comienza hoy tu legado académico."</p>
              <Link href="/upload" className="btn-premium bg-primary text-white text-lg px-12 py-5 shadow-xl shadow-primary/20">
                Subir mi primer documento
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Bookmarks Section */}
      <section className="mb-20">
        <div className="flex items-center gap-6 mb-12">
            <h2 className="font-headline text-3xl font-bold text-text dark:text-white">Mi Colección Particular</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-cta/20 to-transparent"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bookmarkedFiles && bookmarkedFiles.length > 0 ? (
                bookmarkedFiles.map((bookmark: any) => (
                    <div key={bookmark.id} className="card-premium !p-6 flex items-center gap-6 group hover:border-cta/20 transition-all">
                        <div className="w-16 h-16 rounded-xl liquid-glass flex items-center justify-center text-cta shrink-0 border-cta/10">
                            <Star className="w-8 h-8 fill-cta/10" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">{bookmark.files.career}</span>
                            <Link href={`/file/${bookmark.files.id}`}>
                                <h4 className="font-headline font-bold text-xl text-text dark:text-white group-hover:text-cta transition-colors truncate">{bookmark.files.title}</h4>
                            </Link>
                            <p className="text-xs text-slate-500 font-medium italic">Compartido por {bookmark.files.users?.username}</p>
                        </div>
                        <Link href={`/file/${bookmark.files.id}`} className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-primary group-hover:bg-cta group-hover:text-white transition-all border-primary/10 group-hover:border-cta/20">
                            <Maximize className="w-4 h-4" />
                        </Link>
                    </div>
                ))
            ) : (
                <div className="card-premium col-span-full !p-12 text-center text-slate-400 italic font-body">
                    "Aún no has coleccionado tesoros académicos. Explora el Hub para comenzar."
                </div>
            )}
        </div>
      </section>
    </div>
  );
}
