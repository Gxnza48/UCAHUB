import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Trophy, Medal, Star, ArrowLeft, TrendingUp } from 'lucide-react';

export default async function LeaderboardPage() {
  const supabase = await createClient();

  // Fetch users and their file stats
  // Note: Standard Supabase JS client doesn't support complex group by/sum across tables easily in one call
  // We'll fetch users and then aggregate or use a RPC if available. 
  // For now, let's fetch users and files and do the math. 
  
  const { data: usersData, error: usersError } = await supabase
    .from('users')
    .select('id, username');

  const { data: filesData, error: filesError } = await supabase
    .from('files')
    .select('user_id, download_count');

  if (usersError || filesError) {
    return <div className="pt-32 px-6 text-center italic">Error al cargar la excelencia académica.</div>;
  }

  // Aggregate stats
  const leaderStats = usersData.map(user => {
    const userFiles = filesData.filter(f => f.user_id === user.id);
    const filesCount = userFiles.length;
    const totalDownloads = userFiles.reduce((acc, f) => acc + (f.download_count || 0), 0);
    const reputation = (filesCount * 10) + (totalDownloads * 2);
    
    return {
      ...user,
      filesCount,
      totalDownloads,
      reputation
    };
  }).sort((a, b) => b.reputation - a.reputation);

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen">
      <header className="mb-16 text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
           <Link href="/hub" className="liquid-glass p-3 rounded-full hover:bg-primary/10 transition-colors text-primary border-primary/20">
             <ArrowLeft className="w-6 h-6" />
           </Link>
           <h1 className="font-headline text-5xl md:text-7xl font-bold text-text dark:text-white tracking-tighter">Hall de la <span className="text-gradient">Fama</span></h1>
        </div>
        <p className="font-body text-xl text-slate-500 max-w-2xl mx-auto italic">
          "Reconociendo a los mentes más brillantes que fortalecen nuestra inteligencia colectiva."
        </p>
      </header>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-end">
        {/* Second Place */}
        {leaderStats[1] && (
          <div className="order-2 md:order-1 card-premium !p-8 flex flex-col items-center text-center border-slate-200/50 h-fit">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold mb-4 border-2 border-slate-200 relative">
               <Medal className="w-8 h-8" />
               <span className="absolute -top-2 -right-2 bg-slate-400 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center font-black">2º</span>
            </div>
            <h3 className="font-headline text-2xl font-bold text-text mb-2">{leaderStats[1].username}</h3>
            <span className="text-cta font-black text-xl mb-4">{leaderStats[1].reputation} <span className="text-[10px] uppercase">pts</span></span>
            <div className="flex gap-4 text-[10px] font-black uppercase text-slate-400">
               <span>{leaderStats[1].filesCount} Aportes</span>
               <span>{leaderStats[1].totalDownloads} Lecturas</span>
            </div>
          </div>
        )}

        {/* First Place */}
        {leaderStats[0] && (
          <div className="order-1 md:order-2 card-premium !p-12 mb-8 md:mb-0 flex flex-col items-center text-center border-primary/20 bg-primary text-white scale-110 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
            <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-cta font-bold mb-6 border-4 border-cta/30 relative z-10">
               <Trophy className="w-12 h-12" />
               <span className="absolute -top-3 -right-3 bg-cta text-white w-8 h-8 rounded-full text-xs flex items-center justify-center font-black shadow-lg">1º</span>
            </div>
            <h3 className="font-headline text-3xl font-black text-white mb-2 relative z-10">{leaderStats[0].username}</h3>
            <span className="text-cta font-black text-3xl mb-6 relative z-10">{leaderStats[0].reputation} <span className="text-xs uppercase">Scholar Points</span></span>
            <div className="flex gap-6 text-[10px] font-black uppercase text-indigo-100 relative z-10">
               <span className="bg-white/10 px-3 py-1 rounded-full">{leaderStats[0].filesCount} Aportes</span>
               <span className="bg-white/10 px-3 py-1 rounded-full">{leaderStats[0].totalDownloads} Lecturas</span>
            </div>
          </div>
        )}

        {/* Third Place */}
        {leaderStats[2] && (
          <div className="order-3 md:order-3 card-premium !p-8 flex flex-col items-center text-center border-amber-900/10 h-fit">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-600/50 font-bold mb-4 border-2 border-amber-100 relative">
               <Medal className="w-8 h-8" />
               <span className="absolute -top-2 -right-2 bg-amber-600/50 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center font-black">3º</span>
            </div>
            <h3 className="font-headline text-2xl font-bold text-text mb-2">{leaderStats[2].username}</h3>
            <span className="text-cta font-black text-xl mb-4">{leaderStats[2].reputation} <span className="text-[10px] uppercase">pts</span></span>
            <div className="flex gap-4 text-[10px] font-black uppercase text-slate-400">
               <span>{leaderStats[2].filesCount} Aportes</span>
               <span>{leaderStats[2].totalDownloads} Lecturas</span>
            </div>
          </div>
        )}
      </div>

      {/* Other rankings */}
      <div className="space-y-4">
        {leaderStats.slice(3).map((user, index) => (
          <div key={user.id} className="card-premium !p-6 flex items-center justify-between group hover:shadow-xl transition-all border-primary/5">
             <div className="flex items-center gap-8">
                <span className="font-headline font-black text-2xl text-slate-300 group-hover:text-primary transition-colors w-8">#{index + 4}</span>
                <div className="w-12 h-12 liquid-glass rounded-xl flex items-center justify-center text-primary font-bold text-lg border-primary/10">
                   {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                   <h4 className="font-headline font-bold text-xl text-text dark:text-white">{user.username}</h4>
                   <div className="flex gap-4 text-[10px] font-bold uppercase tracking-tight text-slate-400">
                      <span>{user.filesCount} Aportes</span>
                      <span>{user.totalDownloads} Lecturas</span>
                   </div>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-cta font-headline">{user.reputation}</span>
                <TrendingUp className="w-4 h-4 text-primary/30" />
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
