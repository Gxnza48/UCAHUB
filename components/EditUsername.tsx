'use client'

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Pencil, Check, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function EditUsername({ initialUsername, userId }: { initialUsername: string, userId: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(initialUsername || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const supabase = createClient();
  const router = useRouter();

  const handleSave = async () => {
    if (!username.trim() || username.length < 3) {
      setError('El nombre debe tener al menos 3 caracteres.');
      return;
    }
    
    if (username === initialUsername) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check 24 hour limit first
      const { data: dbUser } = await supabase.from('users').select('last_username_update, email').eq('id', userId).single();
      
      if (dbUser?.last_username_update) {
        const lastUpdate = new Date(dbUser.last_username_update);
        const now = new Date();
        const hoursPassed = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
        
        if (hoursPassed < 24) {
          setError(`Debes esperar 24 horas para volver a cambiar tu nombre. (Faltan ${Math.ceil(24 - hoursPassed)} hrs)`);
          setLoading(false);
          return;
        }
      }

      // We use Upsert just in case the row somehow still doesn't exist to prevent 0-row silent failures
      const { error: updateError } = await supabase
        .from('users')
        .upsert({ 
          id: userId, 
          username, 
          email: dbUser?.email || 'unknown@uca.edu.ar',
          last_username_update: new Date().toISOString() 
        }, { onConflict: 'id' });

      if (updateError) {
        if (updateError.code === '23505') {
          throw new Error('Este nombre de usuario ya está en uso.');
        }
        throw updateError;
      }

      setIsEditing(false);
      router.refresh();
      
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-3 mb-3 group w-fit">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white line-clamp-1 truncate max-w-xl">
          {initialUsername || 'Usuario UCA'}
        </h1>
        <button 
          onClick={() => setIsEditing(true)}
          className="p-2 text-slate-400 hover:text-primary-container dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all active:scale-95 opacity-0 group-hover:opacity-100 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
          title="Editar nombre de usuario"
        >
          <Pencil className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="mb-4 space-y-2">
      <div className="flex items-center gap-2">
        <input
          autoFocus
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border-2 border-primary-container/30 dark:border-blue-500/30 rounded-xl px-4 py-2 focus:outline-none focus:border-primary-container dark:focus:border-blue-400 focus:ring-4 focus:ring-primary-container/10 dark:focus:ring-blue-500/10 transition-all w-full md:w-auto"
          placeholder="Tu nombre de usuario"
        />
        <div className="flex shrink-0 gap-1 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 h-full">
          <button 
            disabled={loading}
            onClick={handleSave}
            className="p-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shadow-sm active:scale-95 disabled:opacity-50"
            title="Guardar nombre"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
          </button>
          <button 
            disabled={loading}
            onClick={() => { setIsEditing(false); setUsername(initialUsername); setError(''); }}
            className="p-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg transition-colors active:scale-95 disabled:opacity-50"
            title="Cancelar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 dark:text-red-400 text-sm font-bold bg-red-50 dark:bg-red-500/10 w-fit px-3 py-1 rounded-md">{error}</p>}
    </div>
  );
}
