'use client'

import React, { useState, useEffect } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { rateFile } from '@/app/actions/file-actions';

interface RatingSystemProps {
  fileId: string;
  userId: string | undefined;
  initialRating: number; // User's existing rating if any
  averageRating: number;
  totalRatings: number;
}

export function RatingSystem({ fileId, userId, initialRating, averageRating, totalRatings }: RatingSystemProps) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleRate = async (value: number) => {
    if (!userId) {
      setMessage('Inicia sesión para calificar');
      return;
    }

    try {
      setIsSubmitting(true);
      setRating(value);
      await rateFile(fileId, userId, value);
      setMessage('¡Gracias por tu calificación!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error rating file:', error);
      setMessage('Error al calificar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 py-6 border-t border-slate-200 dark:border-slate-700 mt-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg">Calificar este recurso</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Ayuda a otros a encontrar el mejor contenido</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{averageRating.toFixed(1)}</span>
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{totalRatings} calificaciones</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={isSubmitting || !userId}
              className={`p-1 transition-all duration-200 ${!userId ? 'cursor-not-allowed opacity-50' : 'hover:scale-110 active:scale-95'}`}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => handleRate(star)}
            >
              <Star 
                className={`w-8 h-8 transition-colors ${
                  (hover || rating) >= star 
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]' 
                    : 'text-slate-300 dark:text-slate-600'
                }`} 
              />
            </button>
          ))}
        </div>
        {isSubmitting && <Loader2 className="w-5 h-5 animate-spin text-slate-400" />}
      </div>

      {message && (
        <p className={`text-sm font-bold ${message.includes('Error') ? 'text-red-500' : 'text-blue-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
