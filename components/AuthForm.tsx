'use client'

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight, Loader2, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function AuthForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleAnonymousAuth = async () => {
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signInAnonymously();

    if (authError) {
      if (authError.message.includes('not enabled')) {
        setError('El acceso anónimo no está habilitado en Supabase. El administrador debe habilitar "Anonymous sign-ins" en la configuración de Authentication.');
      } else {
        setError(authError.message);
      }
      setLoading(false);
    } else {
      router.push('/hub');
      router.refresh();
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 md:p-10 rounded-3xl lg:rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-black/20">
      
      <div className="text-center mb-8 flex flex-col items-center">
        <Image src="/logo-icon.png" alt="UCAHUB Icon" width={64} height={64} className="w-16 h-16 object-contain mb-4 shadow-sm rounded-xl" />
        <h2 className="font-headline text-3xl font-black text-[#1d3b6f] dark:text-white tracking-tight mb-2">
           Identidad Privada
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
           UCAHUB ahora es 100% anónimo. No almacenamos correos ni datos personales.
        </p>
      </div>

      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl text-sm border border-red-100 dark:border-red-500/20 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span className="font-medium mt-0.5">{error}</span>
          </div>
        )}
        
        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
           <h3 className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-2">
             <ShieldCheck className="w-5 h-5 text-emerald-500" />
             ¿Cómo funciona?
           </h3>
           <ul className="text-sm font-body text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
             <li>Se generará un ID único aleatorio automáticamente.</li>
             <li>Tu ID se guarda en tu navegador de forma segura.</li>
             <li>Nadie podrá vincular tus aportes a tu identidad real.</li>
           </ul>
        </div>

        <button 
          onClick={handleAnonymousAuth}
          disabled={loading}
          className="w-full h-14 mt-4 bg-[#1d3b6f] dark:bg-blue-600 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-primary-container/20 dark:hover:shadow-blue-900/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:active:scale-100"
        >
          {loading ? (
             <><Loader2 className="w-5 h-5 animate-spin" /> Creando identidad...</>
          ) : (
            <>Generar ID Anónimo y Entrar <ArrowRight className="w-5 h-5" /></>
          )}
        </button>
      </div>
    </div>
  );
}

