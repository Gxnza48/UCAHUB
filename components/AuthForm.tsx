'use client'

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = isLogin 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (authError) {
      if (authError.message.includes('Email not confirmed')) {
        setError('Debes confirmar tu correo electrónico antes de poder iniciar sesión. Revisa tu bandeja de entrada.');
      } else if (authError.message.includes('Invalid login credentials')) {
        setError('Tus credenciales son incorrectas. Verifica tu contraseña y correo.');
      } else {
        setError(authError.message);
      }
      setLoading(false);
    } else {
      if (!isLogin) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
           setError('¡Registro exitoso! Por favor verifica tu correo electrónico para confirmar tu cuenta y luego inicia sesión.');
           setLoading(false);
           return;
        }
      }
      router.push('/hub');
      router.refresh();
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-black/20">
      
      <div className="text-center mb-8">
        <h2 className="font-headline text-3xl font-black text-[#1d3b6f] dark:text-white tracking-tight mb-2">
           {isLogin ? 'Bienvenido a UCAHUB' : 'Crea tu Cuenta'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
           {isLogin ? 'Ingresa tus datos para continuar.' : 'Únete a la mayor red de recursos universitarios.'}
        </p>
      </div>

      <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-8 relative">
        <button 
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 ${isLogin ? 'bg-white dark:bg-slate-700 text-[#1d3b6f] dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          Iniciar sesión
        </button>
        <button 
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 ${!isLogin ? 'bg-white dark:bg-slate-700 text-[#1d3b6f] dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          Registrarse
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl text-sm border border-red-100 dark:border-red-500/20 flex items-start gap-3">
            <InfoIcon error />
            <span className="font-medium mt-0.5">{error}</span>
          </div>
        )}
        
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Correo electrónico institucional</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-primary-container dark:group-focus-within:text-blue-400 transition-colors w-5 h-5 pointer-events-none" />
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary-container/20 dark:focus:border-blue-500/30 rounded-2xl focus:ring-4 focus:ring-primary-container/10 dark:focus:ring-blue-500/10 transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none" 
              placeholder="ejemplo@uca.edu.ar" 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Contraseña secreta</label>
            {isLogin && <button type="button" onClick={() => alert("Función de reseteo próximamente.")} className="text-xs font-bold text-primary-container dark:text-blue-400 hover:text-[#1d3b6f] dark:hover:text-blue-300 transition-colors">¿Olvidaste tu contraseña?</button>}
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-primary-container dark:group-focus-within:text-blue-400 transition-colors w-5 h-5 pointer-events-none" />
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 pl-12 pr-12 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary-container/20 dark:focus:border-blue-500/30 rounded-2xl focus:ring-4 focus:ring-primary-container/10 dark:focus:ring-blue-500/10 transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none" 
              placeholder="••••••••" 
            />
          </div>
        </div>
        
        <button 
          disabled={loading}
          type="submit" 
          className="w-full h-14 mt-4 bg-[#1d3b6f] dark:bg-blue-600 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-primary-container/20 dark:hover:shadow-blue-900/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:active:scale-100"
        >
          {loading ? (
             <><Loader2 className="w-5 h-5 animate-spin" /> Procesando...</>
          ) : (
            <>{isLogin ? 'Entrar a UCAHUB' : 'Crear cuenta'} <ArrowRight className="w-5 h-5" /></>
          )}
        </button>
      </form>
    </div>
  );
}

function InfoIcon({ error }: { error?: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${error ? 'text-red-500 dark:text-red-400' : 'text-primary'}`}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
